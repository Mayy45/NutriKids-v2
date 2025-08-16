require('dotenv').config();
const Hapi           = require('@hapi/hapi');
const Inert          = require('@hapi/inert');
const { PrismaClient } = require('@prisma/client');
const Path           = require('path');
const commentRoutes  = require('./routes/comment');
const authRoutes     = require('./routes/auth');
const userRoutes     = require('./routes/user');
const saveMenuRoutes = require('./routes/save-menu');

const prisma = new PrismaClient();

const FRONTEND_URL = [
  'http://localhost:8110',
  'https://nutrikids-v2-production-0b6d.up.railway.app',
];

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: '0.0.0.0',
    
    routes: {
      cors: {
        origin: FRONTEND_URL,        
        credentials: true,
        additionalHeaders: [
          'cache-control',
          'x-requested-with',
          'content-type',
          'authorization',
        ],
        additionalExposedHeaders: ['authorization'],
      },
    },
  });

  await server.register(Inert);

  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: Path.join(__dirname, 'dist'),
        index: ['index.html'],
      },
    },
  });

  

  server.route([
    ...commentRoutes,
    ...authRoutes,
    ...userRoutes,
    ...saveMenuRoutes,
  ]);

  await server.start();
  console.log('Server running on', server.info.uri);
};

init();
