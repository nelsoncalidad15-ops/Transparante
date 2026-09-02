import type { IncomingMessage, ServerResponse } from 'node:http';

export type ApiRequest = IncomingMessage & { body?: unknown; method?: string };
export type ApiResponse = ServerResponse & { status: (code: number) => ApiResponse; json: (value: unknown) => void; send: (value: string) => void; setHeader: (name: string, value: string | string[]) => ApiResponse };

export const sendJson = (res: ServerResponse, status: number, value: unknown) => {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(value));
};

export const readBody = async (req: IncomingMessage): Promise<Record<string, unknown>> => {
  let raw = '';
  for await (const chunk of req) raw += chunk;
  if (!raw) return {};
  try { return JSON.parse(raw) as Record<string, unknown>; } catch { throw new Error('JSON inválido.'); }
};

export const methodNotAllowed = (res: ServerResponse, allowed: string[]) => {
  res.setHeader('Allow', allowed);
  sendJson(res, 405, { error: 'Método no permitido.' });
};
