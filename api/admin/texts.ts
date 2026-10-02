import type { IncomingMessage, ServerResponse } from 'node:http';
import { callAppsScript } from '../_lib/appsScript';
import { requireAdmin } from '../_lib/auth';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!['GET', 'POST'].includes(req.method || '')) return methodNotAllowed(res, ['GET', 'POST']);
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') return sendJson(res, 200, await callAppsScript('getSiteTexts'));
    return sendJson(res, 200, await callAppsScript('updateSiteTexts', await readBody(req)));
  } catch (error) { return sendJson(res, 503, { error: error instanceof Error ? error.message : 'No se pudieron guardar los textos.' }); }
}
