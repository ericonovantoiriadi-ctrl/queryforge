const { getQueries, getStats } = require('../models/database');

async function routes(fastify) {
    fastify.get('/history', async (req, reply) => {
        return getQueries(50);
    });
    fastify.get('/stats', async (req, reply) => {
        return getStats();
    });
}

module.exports = routes;
