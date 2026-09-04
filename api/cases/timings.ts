import type { IncomingMessage, ServerResponse } from 'node:http';
import { callAppsScript } from '../_lib/appsScript';
import { requireAdmin, getSession } from '../_lib/auth';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!['GET', 'POST'].includes(req.method || '')) return methodNotAllowed(res, ['GET', 'POST']);
  if (req.method === 'GET') {
    if (!getSession(req)) return sendJson(res, 401, { error: 'Se requiere una sesión activa.' });
    try { return sendJson(res, 200, await callAppsScript('getCaseTimings')); }
    catch (error) { return sendJson(res, 503, { error: error instanceof Error ? error.message : 'Tiempos no disponibles.' }); }
  }
  if (!requireAdmin(req, res)) return;
  try { return sendJson(res, 200, await callAppsScript('updateCaseTimings', await readBody(req))); }
  catch (error) { return sendJson(res, 503, { error: error instanceof Error ? error.message : 'No se pudieron guardar los tiempos.' }); }
}
