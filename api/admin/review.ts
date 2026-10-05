import type { IncomingMessage, ServerResponse } from 'node:http';
import { callAppsScript } from '../_lib/appsScript';
import { requireAdmin } from '../_lib/auth';
import { methodNotAllowed, readBody, sendJson } from '../_lib/http';

export default async function handler(req: IncomingMessage, res: ServerResponse) {
  if (!['GET', 'POST', 'PUT'].includes(req.method || '')) return methodNotAllowed(res, ['GET', 'POST', 'PUT']);
  if (!requireAdmin(req, res)) return;
  try {
    if (req.method === 'GET') return sendJson(res, 200, await callAppsScript('getReview'));
    const body = await readBody(req);
    if (!Array.isArray(body.stages) || !Array.isArray(body.faqs) || !Array.isArray(body.validations)) {
      return sendJson(res, 400, { error: 'Faltan etapas, preguntas o validaciones.' });
    }
    return sendJson(res, 200, await callAppsScript(req.method === 'PUT' ? 'publishReview' : 'updateReview', body));
  } catch (error) {
    return sendJson(res, 503, { error: error instanceof Error ? error.message : 'No se pudo guardar la revisión.' });
  }
}
