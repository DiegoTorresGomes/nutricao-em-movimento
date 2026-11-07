// Local-only command wrapper. Does not load or rewrite .env.
// node scripts/editorial-local-env.mjs CONFIG.json NODE_SCRIPT [args...]
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { pathToFileURL } from 'node:url';

export function localEnvironment(configPath) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8').replace(/^\uFEFF/, ''));
  const url = new URL(config.DATABASE_URL);
  if (config.DB_HOST !== '127.0.0.1' || config.DB_NAME !== 'nutricao_editorial_disposable'
    || Number(config.DB_PORT) !== 33317 || url.hostname !== config.DB_HOST
    || Number(url.port) !== 33317 || url.pathname !== `/${config.DB_NAME}`
    || decodeURIComponent(url.username) !== config.DB_USER
    || decodeURIComponent(url.password) !== config.DB_PASSWORD || url.protocol !== 'mysql:') {
    throw new Error('Refusing a connection outside the explicit disposable localhost database.');
  }
  if (!config.AUTH_SECRET || !config.CRON_SECRET) throw new Error('Missing local-only test secrets.');
  return { ...process.env, ...config, NEXT_TELEMETRY_DISABLED: '1' };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const [, , configPath, script, ...args] = process.argv;
  if (!configPath || !script) throw new Error('Usage: editorial-local-env.mjs CONFIG.json NODE_SCRIPT [args...]');
  const child = spawn(process.execPath, [script, ...args], { env: localEnvironment(configPath), stdio: 'inherit' });
  child.on('error', error => { console.error(error.message); process.exitCode = 1; });
  child.on('exit', code => { process.exitCode = code ?? 1; });
}
