// Existing private local configuration, separate disposable database.
import { localEnvironment } from './editorial-local-env.mjs';
import { spawn } from 'node:child_process';
const [, , config, script, ...args] = process.argv;
if (!config || !script) throw new Error('Expected local config and Node script');
const env = localEnvironment(config);
const url = new URL(env.DATABASE_URL);
url.pathname = '/nutricao_consolidacao_disposable';
env.DATABASE_URL = url.href;
env.DB_NAME = 'nutricao_consolidacao_disposable';
const child = spawn(process.execPath, [script, ...args], { env, stdio: 'inherit', windowsHide: true });
child.on('error', error => { console.error(error.message); process.exitCode = 1; });
child.on('exit', code => { process.exitCode = code ?? 1; });
