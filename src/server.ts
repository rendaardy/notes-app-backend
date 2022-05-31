import { exit } from 'node:process';
import { server as createServer } from '@hapi/hapi';
import { default as HapiPino } from 'hapi-pino';

import { routes } from './routes.js';

const server = createServer({
  port: 5000,
  host: 'localhost',
  debug: false,
  routes: {
    cors: {
      origin: ['*'],
      headers: ['Accept', 'Authorization', 'Content-Type', 'If-None-Match'],
    },
  },
});

server.route(routes);

try {
  await server.register({
    plugin: HapiPino,
    options: {
      // prettyPrint: env.NODE_ENV !== 'production',
      redact: ['req.headers.authorization'],
    },
  });

  server.log(['info'], `Server running on ${server.info.uri}`);
  await server.start();
} catch (error) {
  server.log(['error'], `${(error as Error).message}`);
  exit(1);
}
