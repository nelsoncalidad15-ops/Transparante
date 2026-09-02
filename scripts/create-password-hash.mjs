import crypto from 'node:crypto';
import readline from 'node:readline/promises';

const terminal = readline.createInterface({ input: process.stdin, output: process.stdout });
const password = await terminal.question('Nueva contraseña de administrador: ');
terminal.close();

if (password.length < 12) {
  console.error('Usá al menos 12 caracteres.');
  process.exit(1);
}

const salt = crypto.randomBytes(16).toString('hex');
crypto.scrypt(password, salt, 64, (error, key) => {
  if (error) throw error;
  console.log(`ADMIN_PASSWORD_HASH=scrypt$${salt}$${key.toString('hex')}`);
});
