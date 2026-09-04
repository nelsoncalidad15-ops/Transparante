import type { IncomingMessage, ServerResponse } from 'node:http';
import { createSession, setSessionCookie, verifyLogin } from '../_lib/auth';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  try {
    const { password } = await readBody(req);
    const role = typeof password === 'string' ? await verifyLogin(password) : null;
    if (!role) return sendJson(res, 401, { error: 'Credenciales inválidas.' });
    setSessionCookie(res, createSession(role));
    return sendJson(res, 200, { authenticated: true, role });
  } catch {
    return sendJson(res, 500, { error: 'No se pudo iniciar la sesión.' });
  }
}
