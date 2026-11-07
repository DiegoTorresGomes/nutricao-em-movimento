// Loopback-only helper for the approved CMS application, not a deployed server.
// An isolated generated output avoids collisions with the normal .next build.
import { createServer } from 'node:http';
import next from 'next';
import config from '../next.config.mjs';

process.env.NODE_ENV = 'development';
const hostname = '127.0.0.1';
const port = 33118;
const app = next({ dev: true, dir: process.cwd(), hostname, port, conf: { ...config, distDir: '.next/editorial-cms' } });
await app.prepare();
const handle = app.getRequestHandler();
const server = createServer((request, response) => handle(request, response));
server.listen(port, hostname, () => console.log('Local editorial CMS ready on loopback port 33118.'));
process.on('SIGTERM', () => { server.close(); app.close(); });
