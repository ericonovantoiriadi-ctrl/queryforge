const { analyzeQuery } = require('../engine/mimo');
const { parseSQL } = require('../engine/parser');
const { saveQuery, saveRecommendation } = require('../models/database');

async function routes(fastify) {
    fastify.post('/analyze', async (req, reply) => {
        const { sql, dialect } = req.body || {};
        if (!sql) return reply.code(400).send({ error: 'SQL required' });

        const start = Date.now();
        const parsed = parseSQL(sql);
        const { result, tokens } = await analyzeQuery(sql, dialect || 'postgresql');
        const elapsed = Date.now() - start;

        const queryId = saveQuery(sql, dialect || 'postgresql', result.complexity || 'medium', (result.issues || []).length, tokens, elapsed);

        for (const issue of (result.issues || [])) {
            saveRecommendation(queryId, issue.type || 'performance', issue.title, issue.description || '', issue.impact || 'medium', issue.sql_suggestion || '');
        }

        return { id: queryId, ...result, tokens_used: tokens, analysis_time_ms: elapsed, parsed };
    });
}

module.exports = routes;
