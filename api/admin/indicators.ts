import type { IncomingMessage, ServerResponse } from 'node:http';
import { callAppsScript } from '../_lib/appsScript';
import { requireAdmin } from '../_lib/auth';
import { methodNotAllowed, sendJson } from '../_lib/http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  if (!requireAdmin(req, res)) return;
  try { return sendJson(res, 200, await callAppsScript('getIndicators')); }
  catch (error) { return sendJson(res, 503, { error: error instanceof Error ? error.message : 'Indicadores no disponibles.' }); }
}
