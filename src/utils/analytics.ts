/** Analítica anónima: exclusivamente eventos de uso. No almacena identidad. */
export type AnalyticsEvent = 'page_view' | 'search' | 'contact_click' | 'article_open' | 'stage_open';
export function trackEvent(type: AnalyticsEvent, section: string, detail = ''): void {
  if (typeof window === 'undefined' || navigator.doNotTrack === '1') return;
  const data = { type, section: String(section).slice(0, 64), detail: String(detail).slice(0, 120) };
  // Nunca se envían valores de formularios, números de operación ni datos personales.
  void fetch('/api/analytics', {
    method: 'POST', credentials: 'same-origin', keepalive: true,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).catch(() => undefined);
}
