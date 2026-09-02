import type { IncomingMessage, ServerResponse } from 'node:http';
import { callAppsScript } from './_lib/appsScript';
import { methodNotAllowed, sendJson } from './_lib/http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (req.method !== 'GET') return methodNotAllowed(res, ['GET']);
  try {
    const data = await callAppsScript('getPublicContent');
    res.setHeader('Cache-Control', 's-maxage=120, stale-while-revalidate=600');
    return sendJson(res, 200, data);
  } catch (error) {
    return sendJson(res, 503, { error: error instanceof Error ? error.message : 'Contenido no disponible.' });
  }
}
