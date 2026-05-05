async function routes(fastify) {
    const { getQueries, getQuery, getRecommendations, getStats } = require('../models/database');

    fastify.get('/', async (req, reply) => {
        return reply.view('index.hbs', { title: 'QueryForge' });
    });

    fastify.get('/dashboard', async (req, reply) => {
        const queries = getQueries(20);
        const stats = getStats();
        return reply.view('dashboard.hbs', { title: 'Dashboard', queries, stats });
    });

    fastify.get('/results/:id', async (req, reply) => {
        const query = getQuery(req.params.id);
        if (!query) return reply.code(404).send('Not found');
        const recommendations = getRecommendations(query.id);
        return reply.view('results.hbs', { title: 'Results', query, recommendations });
    });

    fastify.get('/schema', async (req, reply) => {
        return reply.view('schema.hbs', { title: 'Schema Advisor' });
    });
}

module.exports = routes;
