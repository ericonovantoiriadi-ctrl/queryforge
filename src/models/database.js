const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = process.env.DATABASE_URL || path.join(__dirname, '..', '..', 'data', 'queryforge.db');
let db;

async function initDB() {
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.exec(`
        CREATE TABLE IF NOT EXISTS queries (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            sql_text TEXT NOT NULL,
            dialect TEXT DEFAULT 'postgresql',
            complexity TEXT DEFAULT 'medium',
            findings INTEGER DEFAULT 0,
            tokens_used INTEGER DEFAULT 0,
            analysis_time_ms INTEGER DEFAULT 0,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        );
        CREATE TABLE IF NOT EXISTS recommendations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            query_id INTEGER NOT NULL,
            type TEXT NOT NULL,
            title TEXT NOT NULL,
            description TEXT DEFAULT '',
            impact TEXT DEFAULT 'medium',
            sql_suggestion TEXT DEFAULT '',
            FOREIGN KEY (query_id) REFERENCES queries(id) ON DELETE CASCADE
        );
        CREATE TABLE IF NOT EXISTS token_usage (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL UNIQUE,
            total_tokens INTEGER DEFAULT 0,
            query_count INTEGER DEFAULT 0
        );
    `);
}

function saveQuery(sql, dialect, complexity, findings, tokensUsed, analysisTimeMs) {
    const r = db.prepare('INSERT INTO queries (sql_text, dialect, complexity, findings, tokens_used, analysis_time_ms) VALUES (?,?,?,?,?,?)').run(sql, dialect, complexity, findings, tokensUsed, analysisTimeMs);
    const today = new Date().toISOString().split('T')[0];
    db.prepare('INSERT INTO token_usage (date, total_tokens, query_count) VALUES (?,?,1) ON CONFLICT(date) DO UPDATE SET total_tokens=total_tokens+?, query_count=query_count+1').run(today, tokensUsed, tokensUsed);
    return r.lastInsertRowid;
}

function saveRecommendation(queryId, type, title, description, impact, sqlSuggestion) {
    db.prepare('INSERT INTO recommendations (query_id, type, title, description, impact, sql_suggestion) VALUES (?,?,?,?,?,?)').run(queryId, type, title, description, impact, sqlSuggestion);
}

function getQueries(limit=20) { return db.prepare('SELECT * FROM queries ORDER BY created_at DESC LIMIT ?').all(limit); }
function getQuery(id) { return db.prepare('SELECT * FROM queries WHERE id=?').get(id); }
function getRecommendations(queryId) { return db.prepare('SELECT * FROM recommendations WHERE query_id=?').all(queryId); }
function getStats() {
    const total = db.prepare('SELECT COUNT(*) as c, COALESCE(SUM(tokens_used),0) as t FROM queries').get();
    return { total_queries: total.c, total_tokens: total.t };
}

module.exports = { initDB, saveQuery, saveRecommendation, getQueries, getQuery, getRecommendations, getStats };
