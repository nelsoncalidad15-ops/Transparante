import type { IncomingMessage, ServerResponse } from 'node:http';
import { isAuthenticated } from '../_lib/auth';
import { methodNotAllowed, sendJson } from '../_lib/http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  return sendJson(res, 200, { authenticated: isAuthenticated(req) });
}
