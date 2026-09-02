import type { IncomingMessage, ServerResponse } from 'node:http';
import { clearSessionCookie } from '../_lib/auth';
import { methodNotAllowed, sendJson } from '../_lib/http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'POST') return methodNotAllowed(res, ['POST']);
  clearSessionCookie(res);
  return sendJson(res, 200, { authenticated: false });
}
