import type { IncomingMessage, ServerResponse } from 'node:http';
import { getSession } from '../_lib/auth';
import { methodNotAllowed, sendJson } from '../_lib/http';

export default function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const session = getSession(req);
  return sendJson(res, 200, { authenticated: !!session, role: session?.role || null });
}
