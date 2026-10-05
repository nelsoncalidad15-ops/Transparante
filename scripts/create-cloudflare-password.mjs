import { createHash, randomBytes } from 'node:crypto';

const password = randomBytes(32).toString('base64url');
const hash = createHash('sha256').update(password).digest('hex');
process.stdout.write(`Contraseña (guardala en un gestor): ${password}\nSHA-256 para Cloudflare: ${hash}\n`);
