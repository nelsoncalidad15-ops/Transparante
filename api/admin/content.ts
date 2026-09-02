import type { IncomingMessage, ServerResponse } from 'node:http';
import { callAppsScript } from '../_lib/appsScript';
import { requireAdmin } from '../_lib/auth';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!['GET', 'POST'].includes(req.method || '')) return methodNotAllowed(res, ['GET', 'POST']);
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') return sendJson(res, 200, await callAppsScript('getAdminContent'));
    const body = await readBody(req);
    return sendJson(res, 200, await callAppsScript('updateContent', body));
  } catch (error) { return sendJson(res, 503, { error: error instanceof Error ? error.message : 'No se pudo actualizar el contenido.' }); }
}
