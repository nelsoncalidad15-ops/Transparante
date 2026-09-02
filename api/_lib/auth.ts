import crypto from 'node:crypto';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { sendJson } from './http';

const COOKIE_NAME = 'autosol_admin_session';
const SESSION_MAX_AGE = 60 * 60 * 8;

const getSecret = () => process.env.SESSION_SECRET || '';

const sign = (value: string) => crypto.createHmac('sha256', getSecret()).update(value).digest('base64url');

const cookies = (req: IncomingMessage) => Object.fromEntries((req.headers.cookie || '').split(';').map((item) => {
  const [key, ...value] = item.trim().split('=');
  return [key, decodeURIComponent(value.join('='))];
}).filter(([key]) => key));

export const createSession = () => {
  if (!getSecret()) throw new Error('SESSION_SECRET no está configurado.');
  const expires = Math.floor(Date.now() / 1000) + SESSION_MAX_AGE;
  const nonce = crypto.randomBytes(16).toString('base64url');
  const payload = `${expires}.${nonce}`;
  return `${payload}.${sign(payload)}`;
};

export const setSessionCookie = (res: ServerResponse, token: string) => {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${encodeURIComponent(token)}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${SESSION_MAX_AGE}`);
};

export const clearSessionCookie = (res: ServerResponse) => {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0`);
};

export const isAuthenticated = (req: IncomingMessage) => {
  const token = cookies(req)[COOKIE_NAME];
  if (!token || !getSecret()) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  const [expires, nonce, signature] = parts;
  if (!expires || !nonce || !signature || Number(expires) < Math.floor(Date.now() / 1000)) return false;
  const expected = sign(`${expires}.${nonce}`);
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
};

export const requireAdmin = (req: IncomingMessage, res: ServerResponse) => {
  if (isAuthenticated(req)) return true;
  sendJson(res, 401, { error: 'Se requiere una sesión de administrador.' });
  return false;
};

export const verifyPassword = async (password: string) => {
  const stored = process.env.ADMIN_PASSWORD_HASH || '';
  const [algorithm, salt, expected] = stored.split('$');
  if (algorithm !== 'scrypt' || !salt || !expected || !password) return false;
  const actual = await new Promise<Buffer>((resolve, reject) => crypto.scrypt(password, salt, 64, (error, key) => error ? reject(error) : resolve(key as Buffer)));
  const expectedBuffer = Buffer.from(expected, 'hex');
  return expectedBuffer.length === actual.length && crypto.timingSafeEqual(expectedBuffer, actual);
};
