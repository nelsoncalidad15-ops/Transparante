export const callAppsScript = async (action: string, payload: Record<string, unknown> = {}) => {
  const endpoint = process.env.APPS_SCRIPT_URL;
  const secret = process.env.APPS_SCRIPT_SHARED_SECRET;
  if (!endpoint || !secret) throw new Error('Apps Script no está configurado en Vercel.');
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ action, payload, secret }),
  });
  if (!response.ok) throw new Error(`Apps Script respondió ${response.status}.`);
  const data = await response.json() as { ok?: boolean; error?: string };
  if (!data.ok) throw new Error(data.error || 'Apps Script rechazó la solicitud.');
  return data;
};
