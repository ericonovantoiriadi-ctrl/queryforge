require('dotenv').config();
const fastify = require('fastify')({ logger: true });
const path = require('path');
const { initDB } = require('./models/database');

fastify.register(require('@fastify/view'), {
    engine: { handlebars: require('handlebars') },
    root: path.join(__dirname, '..', 'views'),
    layout: '/layouts/main.hbs',
});
fastify.register(require('@fastify/static'), {
    root: path.join(__dirname, '..', 'public'),
    prefix: '/static/',
});

fastify.register(require('./routes/pages'));
fastify.register(require('./routes/analyze'), { prefix: '/api' });
fastify.register(require('./routes/history'), { prefix: '/api' });

const start = async () => {
    await initDB();
    const port = process.env.PORT || 4000;
    await fastify.listen({ port, host: '0.0.0.0' });
    console.log('QueryForge running on http://localhost:' + port);
};
start();
