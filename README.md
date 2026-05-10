# ⚡ QueryForge

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Node.js 20+](https://img.shields.io/badge/node.js-20+-green.svg)](https://nodejs.org)
[![MiMo v2.5](https://img.shields.io/badge/MiMo-v2.5-orange.svg)](https://mimo.xiaomi.com)

> **SQL query optimizer with AI-powered explain plan analysis — powered by Xiaomi MiMo v2.5.**

Paste a SQL query. Get optimization suggestions, visual explain plan trees, index recommendations, and rewritten queries — all analyzed by MiMo's reasoning engine.

**[Live Demo](https://queryforge-demo.trycloudflare.com)** · **[Report Bug](../../issues)** · **[Request Feature](../../issues)**

---

## 📸 Screenshots

| SQL Input | Explain Plan | Optimization Suggestions |
|-----------|-------------|-------------------------|
| ![Input](docs/screenshots/input.png) | ![Plan](docs/screenshots/plan.png) | ![Suggestions](docs/screenshots/suggestions.png) |

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────┐
│                     QueryForge                        │
│              (Fastify + Handlebars + D3.js)            │
├──────────────────────────────────────────────────────┤
│                                                        │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐        │
│  │  SQL     │    │  MiMo    │    │  D3.js   │        │
│  │  Input   │───►│  Analyze │───►│  Visual  │        │
│  └──────────┘    └────┬─────┘    └──────────┘        │
│                        │                               │
│          ┌─────────────┼─────────────┐                │
│          ▼             ▼             ▼                │
│    ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│    │ Optimize │  │  Index   │  │ Explain  │         │
│    │ Queries  │  │ Advisor  │  │ Plan     │         │
│    └──────────┘  └──────────┘  └──────────┘         │
│                        │                               │
│                  ┌─────▼─────┐                        │
│                  │  SQLite   │                        │
│                  └───────────┘                        │
└──────────────────────────────────────────────────────┘
```

---

## ✨ Features

- ⚡ **Query Optimization** — AI-suggested rewrites for better performance
- 📊 **Visual Explain Plan** — D3.js tree visualization of execution plans
- 📇 **Index Advisor** — Detect missing indexes and suggest composite keys
- 🐛 **Bug Detection** — N+1 queries, cartesian joins, type mismatches
- 📈 **Query History** — Track and compare analysis results over time
- 🔗 **REST API** — Integrate with CI/CD for automated query review
- 🐳 **Docker Ready** — One-command deployment

---

## 🔥 Token Economics

| Query Type | Complexity | Tokens | Notes |
|-----------|-----------|--------|-------|
| Simple SELECT | Low | ~2K | Single table, basic WHERE |
| Multi-table JOIN | Medium | ~3-5K | 2-4 tables, GROUP BY |
| Complex subquery | High | ~5-8K | CTEs, window functions |
| Schema review (10 tables) | — | ~10K | Full DDL analysis |
| Full DB audit (50+ tables) | — | ~50K | All tables + relationships |

---

## 🚀 Quick Start

```bash
git clone https://github.com/ericonovantoiriadi-ctrl/queryforge.git
cd queryforge
npm install
cp .env.example .env
# Edit .env — set MIMO_API_KEY
npm run dev
```

Open [http://localhost:4000](http://localhost:4000)

### Docker

```bash
docker compose up --build
```

---

## 📖 API

```bash
# Analyze query
curl -X POST http://localhost:4000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"sql": "SELECT * FROM users WHERE email LIKE \'%test%\'", "dialect": "postgresql"}'

# Query history
curl http://localhost:4000/api/history

# Stats
curl http://localhost:4000/api/stats
```

---

## 🤝 Contributing · 📄 License (MIT)
