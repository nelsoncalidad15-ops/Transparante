import type { FAQItem, LibraryArticle, ProcessStage } from '../types';

export type WebRow = { date: string; type: string; section: string; category: string; detail: string };
export type RankedItem = { label: string; count: number; percent: number };
export type Insight = { title: string; evidence: string; action: string };

export function filterWebRows(rows: WebRow[], filters: { period: string; from: string; to: string; type: string; section: string }, now = new Date()): WebRow[] {
  const { period, from, to, type, section } = filters;
  if (period === 'custom' && from && to && from > to) return [];
  const start = period === 'custom' ? (from ? new Date(`${from}T00:00:00`) : null) : new Date(now.getFullYear(), now.getMonth(), now.getDate() - Number(period) + 1);
  const end = period === 'custom' && to ? new Date(`${to}T23:59:59.999`) : null;
  return rows.filter(row => {
    const date = new Date(row.date);
    return Number.isFinite(date.getTime()) && (!start || date >= start) && (!end || date <= end) && (!type || row.type === type) && (!section || row.section === section);
  });
}

export const sectionNames: Record<string, string> = {
  home: 'Inicio', process: 'Mi proceso de compra', documents: 'Documentación',
  times: 'Tiempos orientativos', financing: 'Financiación', delivery: 'Entrega',
  dictionary: 'Diccionario', library: 'Biblioteca', faq: 'Preguntas frecuentes',
  search: 'Buscador', 'article-detail': 'Artículos',
};

const topicNames = ['Patentamiento', 'Facturación', 'Gestoría', 'Documentación', 'Financiación', 'Preparación del vehículo', 'Entrega', 'Otros temas'];
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function topicFor(value: string): string {
  const text = normalize(value);
  if (/patent|dominio|registro/.test(text)) return 'Patentamiento';
  if (/factur|comprobant/.test(text)) return 'Facturación';
  if (/gestor|tramite|transferenc/.test(text)) return 'Gestoría';
  if (/document|papel|requisito/.test(text)) return 'Documentación';
  if (/financ|credito|cuota|pago/.test(text)) return 'Financiación';
  if (/prepar|taller|pdi/.test(text)) return 'Preparación del vehículo';
  if (/entrega|retiro|turno/.test(text)) return 'Entrega';
  return 'Otros temas';
}

export function rank(values: string[], total = values.length): RankedItem[] {
  const counts = new Map<string, number>();
  values.forEach(value => counts.set(value, (counts.get(value) || 0) + 1));
  return [...counts].map(([label, count]) => ({ label, count, percent: total ? Math.round(count / total * 100) : 0 }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, 'es'));
}

export function buildWebMetrics(rows: WebRow[], content: { articles: LibraryArticle[]; faqs: FAQItem[]; stages: ProcessStage[] }) {
  const articleBySlug = new Map(content.articles.map(article => [article.slug, article]));
  const faqById = new Map(content.faqs.map(faq => [faq.id, faq]));
  const stageById = new Map(content.stages.map(stage => [stage.id, stage]));
  const visits = rows.filter(row => row.type === 'page_open');
  const searches = rows.filter(row => row.type === 'search' || row.type === 'search_empty');
  const missed = rows.filter(row => row.type === 'search_empty');
  const contacts = rows.filter(row => row.type === 'contact_click');
  const contentOpens = rows.filter(row => ['article_view', 'stage_open', 'faq_open'].includes(row.type));
  const contentLabel = (row: WebRow) => row.type === 'article_view' ? articleBySlug.get(row.detail)?.title || row.detail :
    row.type === 'stage_open' ? stageById.get(row.detail)?.name || row.detail : faqById.get(row.detail)?.question || row.detail;
  const contentTopic = (row: WebRow) => row.type === 'article_view' ? topicFor(`${articleBySlug.get(row.detail)?.category || ''} ${articleBySlug.get(row.detail)?.title || row.detail}`) :
    row.type === 'stage_open' ? topicFor(`${stageById.get(row.detail)?.name || row.detail} ${stageById.get(row.detail)?.category || ''}`) :
      topicFor(`${faqById.get(row.detail)?.category || ''} ${faqById.get(row.detail)?.question || row.detail}`);
  const topicCounts = new Map(topicNames.map(topic => [topic, 0]));
  contentOpens.forEach(row => { const topic = contentTopic(row); topicCounts.set(topic, (topicCounts.get(topic) || 0) + 1); });
  const interests = [...topicCounts].map(([label, count]) => ({ label, count, percent: contentOpens.length ? Math.round(count / contentOpens.length * 100) : 0 }))
    .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label, 'es'));
  const searchTopics = rank(searches.map(row => topicFor(row.category)));
  const missedTopics = rank(missed.map(row => topicFor(row.category)));
  const contactChannels = rank(contacts.map(row => row.category || 'Sin canal'));
  const contactSections = rank(contacts.map(row => sectionNames[row.section] || row.section));
  const sectionInteractions = rank(rows.filter(row => ['article_view', 'stage_open', 'faq_open', 'contact_click', 'contact_menu'].includes(row.type))
    .map(row => sectionNames[row.section] || row.section));
  const elements = rank(rows.filter(row => ['article_view', 'stage_open', 'faq_open', 'contact_click'].includes(row.type)).map(row =>
    row.type === 'contact_click' ? `Contacto · ${row.category}` : `${row.type === 'faq_open' ? 'Pregunta' : row.type === 'stage_open' ? 'Etapa' : 'Artículo'} · ${contentLabel(row)}`));
  const faqRank = rank(rows.filter(row => row.type === 'faq_open').map(contentLabel));
  const insights: Insight[] = [];
  if (searches.length >= 10 && searchTopics[0]?.percent >= 35) insights.push({
    title: `${searchTopics[0].label} concentra las búsquedas`,
    evidence: `${searchTopics[0].count} de ${searches.length} búsquedas (${searchTopics[0].percent} %).`,
    action: 'Revisar la claridad y visibilidad de las respuestas sobre este tema.',
  });
  if (missed.length >= 3 && missedTopics[0]) insights.push({
    title: `Faltan respuestas sobre ${missedTopics[0].label}`,
    evidence: `${missedTopics[0].count} búsquedas sin resultado en esa categoría, de ${missed.length} en total.`,
    action: 'Revisar términos equivalentes y crear o ampliar contenido que responda esa consulta.',
  });
  if (contacts.length >= 5 && contactSections[0]) insights.push({
    title: `Contacto frecuente desde ${contactSections[0].label}`,
    evidence: `${contactSections[0].count} de ${contacts.length} clics hacia canales (${contactSections[0].percent} %).`,
    action: 'Revisar qué información puede aclararse en esa sección; el clic no confirma una consulta atendida.',
  });
  if (faqRank.length && faqRank[0].count >= 5 && faqRank[0].percent >= 40) insights.push({
    title: 'Una pregunta concentra las aperturas',
    evidence: `“${faqRank[0].label}”: ${faqRank[0].count} de ${faqRank.reduce((sum, item) => sum + item.count, 0)} aperturas de preguntas.`,
    action: 'Comprobar que la respuesta sea visible y suficientemente clara.',
  });
  return { visits, searches, missed, contacts, contentOpens, interests, searchTopics, missedTopics, contactChannels, contactSections, sectionInteractions, elements, faqRank, insights };
}
