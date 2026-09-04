import type { IncomingMessage, ServerResponse } from 'node:http';
import { callAppsScript } from './_lib/appsScript';
import { getSession } from './_lib/auth';
import { methodNotAllowed, sendJson } from './_lib/http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  const session = getSession(req);
  if (!session) return sendJson(res, 401, { error: 'Se requiere una sesión activa.' });
  try {
    return sendJson(res, 200, await callAppsScript('getClientCases'));
  } catch (error) {
    return sendJson(res, 503, { error: error instanceof Error ? error.message : 'Casos no disponibles.' });
  }
}
