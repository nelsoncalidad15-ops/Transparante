import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { INITIAL_ARTICLES, INITIAL_FAQS, INITIAL_SITE_TEXTS, INITIAL_STAGES } from '../src/data/defaultData';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'REVISION_PARA_ADMINISTRACION_2026-10-05.html');
const escape = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const field = (label: string, value: unknown) => `<div class="field"><b>${escape(label)}:</b> ${escape(value)}</div>`;
const list = (label: string, values: string[] | undefined) => values?.length ? `<div class="field"><b>${escape(label)}:</b><ul>${values.map((value) => `<li>${escape(value)}</li>`).join('')}</ul></div>` : '';
const review = () => '<div class="review">☐ Correcto &nbsp; ☐ Corregir &nbsp; ☐ Consultar con Administración<div class="note">Corrección / comentario: .............................................................................................................................<br>.............................................................................................................................................................................</div></div>';
const card = (title: string, body: string, id: string) => `<article class="card"><div class="id">${escape(id)}</div><h3>${escape(title)}</h3>${body}${review()}</article>`;

function source(file: string) {
  const absolute = path.join(root, file);
  return ts.createSourceFile(file, fs.readFileSync(absolute, 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

function objectArray(file: string, variableName: string): Array<Record<string, string>> {
  const ast = source(file);
  const result: Array<Record<string, string>> = [];
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === variableName && node.initializer && ts.isArrayLiteralExpression(node.initializer)) {
      for (const element of node.initializer.elements) {
        if (!ts.isObjectLiteralExpression(element)) continue;
        const item: Record<string, string> = {};
        for (const prop of element.properties) {
          if (!ts.isPropertyAssignment(prop)) continue;
          const key = prop.name.getText(ast).replace(/^['"]|['"]$/g, '');
          if (ts.isStringLiteralLike(prop.initializer) || ts.isNumericLiteral(prop.initializer)) item[key] = prop.initializer.text;
        }
        result.push(item);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return result;
}

function stringMap(file: string, variableName: string): Record<string, string> {
  const ast = source(file);
  const result: Record<string, string> = {};
  function visit(node: ts.Node) {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === variableName && node.initializer && ts.isObjectLiteralExpression(node.initializer)) {
      for (const prop of node.initializer.properties) {
        if (ts.isPropertyAssignment(prop) && ts.isStringLiteralLike(prop.initializer)) result[prop.name.getText(ast).replace(/^['"]|['"]$/g, '')] = prop.initializer.text;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return result;
}

function jsxTexts(file: string): string[] {
  const ast = source(file);
  const seen = new Set<string>();
  function visit(node: ts.Node) {
    if (ts.isJsxText(node)) {
      const value = node.getText(ast).replace(/\s+/g, ' ').trim();
      if (value.length > 2) seen.add(value);
    }
    ts.forEachChild(node, visit);
  }
  visit(ast);
  return [...seen];
}

const actionByStage = stringMap('src/components/ProcessTimeline.tsx', 'customerActions');
const sections: string[] = [];

sections.push('<h2>1. Etapas del proceso (7)</h2>');
for (const stage of INITIAL_STAGES) sections.push(card(`${stage.stepNumber}. ${stage.name}`,
  field('Resumen', stage.shortDesc) + field('Explicación', stage.definition) + list('Qué sucede', stage.whatHappens) + field('Qué tenés que hacer', actionByStage[stage.id] || '') + field('Plazo publicado', stage.estimatedTime) + field('Aclaración del plazo', stage.timeDisclaimer) + list('Factores', stage.timeFactors) + field('Qué sigue', stage.nextStep), `Etapa ${stage.id}`));

sections.push('<h2>2. Preguntas frecuentes (22)</h2>');
for (const faq of INITIAL_FAQS) sections.push(card(faq.question, field('Respuesta', faq.answer) + field('Categoría', faq.category), faq.id));

sections.push('<h2>3. Artículos de la biblioteca (10)</h2>');
for (const article of INITIAL_ARTICLES) sections.push(card(article.title,
  field('Resumen', article.shortDesc) + field('Definición', article.definition) + list('Qué sucede', article.whatHappens) + field('Plazo publicado', article.estimatedTime || '') + list('Factores', article.timeFactors) + field('Qué sigue', article.whatNext || ''), article.slug));

sections.push('<h2>4. Textos configurados de la portada y contacto</h2>');
for (const item of INITIAL_SITE_TEXTS.filter((item) => item.active)) sections.push(card(item.label, field('Texto', item.value), item.key));

const structured = [
  ['Documentación, persona física', 'src/components/DocumentsView.tsx', 'docsFisica'],
  ['Documentación, persona jurídica', 'src/components/DocumentsView.tsx', 'docsJuridica'],
  ['Preparación y entrega', 'src/components/DeliveryView.tsx', 'deliverySteps'],
  ['Checklist de entrega', 'src/components/DeliveryView.tsx', 'clientChecklist'],
  ['Diccionario', 'src/components/DictionaryView.tsx', 'termsData'],
] as const;
sections.push('<h2>5. Tarjetas y listas de las secciones</h2>');
for (const [heading, file, variableName] of structured) {
  sections.push(`<h3 class="group">${escape(heading)}</h3>`);
  for (const [index, item] of objectArray(file, variableName).entries()) {
    const title = item.title || item.term || item.text || `Elemento ${index + 1}`;
    sections.push(card(title, Object.entries(item).filter(([key]) => !['id', 'title', 'term', 'text', 'pastelBadge', 'statusColor', 'icon'].includes(key)).map(([key, value]) => field(key, value)).join(''), `${variableName} ${index + 1}`));
  }
}

const visibleFiles = [
  ['Portada', 'src/components/HeroSection.tsx'],
  ['Proceso', 'src/components/ProcessTimeline.tsx'],
  ['Documentación', 'src/components/DocumentsView.tsx'],
  ['Tiempos', 'src/components/TimesSection.tsx'],
  ['Financiación', 'src/components/FinancingView.tsx'],
  ['Entrega', 'src/components/DeliveryView.tsx'],
  ['Diccionario', 'src/components/DictionaryView.tsx'],
  ['Biblioteca', 'src/components/LibraryView.tsx'],
  ['Detalle de artículo', 'src/components/ArticleDetail.tsx'],
  ['Preguntas frecuentes', 'src/components/FAQSection.tsx'],
  ['Pie y contacto', 'src/App.tsx'],
] as const;
sections.push('<h2>6. Otros textos visibles fijos</h2><p>Fragmentos literales de los componentes. Los campos variables se revisan en las secciones anteriores.</p>');
for (const [heading, file] of visibleFiles) {
  sections.push(`<h3 class="group">${escape(heading)}</h3>`);
  for (const [index, value] of jsxTexts(file).entries()) sections.push(card(`Texto ${index + 1}`, field('Publicado', value), file));
}

const html = `<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Ficha de revisión del contenido base — Autosol Confianza</title><style>
@page{size:A4;margin:16mm}body{font-family:Arial,sans-serif;color:#152536;line-height:1.4;max-width:900px;margin:25px auto;padding:0 20px}h1{color:#002244;font-size:26px}h2{color:#002244;border-bottom:2px solid #002244;padding-bottom:8px;margin-top:36px;break-after:avoid}h3{font-size:17px;margin:0 0 8px}.group{margin-top:26px;color:#002244}.card{border:1px solid #cbd3db;border-radius:9px;padding:14px 17px;margin:15px 0;break-inside:avoid}.id{font-size:10px;color:#606b76;margin-bottom:4px}.field{margin:7px 0;white-space:pre-wrap;font-size:13px}.field b{color:#002244}ul{margin:4px 0 4px 19px;padding:0}li{margin:3px 0}.review{border-top:1px solid #ddd;margin-top:12px;padding-top:9px;font-size:12px}.note{line-height:2;color:#666}.intro{background:#f1f5f8;border-left:4px solid #002244;padding:13px 16px;font-size:13px}.toolbar{margin:18px 0}.toolbar button{background:#002244;color:white;border:0;border-radius:8px;padding:10px 16px;cursor:pointer}@media print{body{margin:0;padding:0;max-width:none}.toolbar{display:none}}
</style></head><body><h1>Autosol Confianza — ficha de revisión del contenido base</h1><div class="intro"><b>Base revisada:</b> textos iniciales del código publicado el 5/10/2026. Esta ficha reúne las etapas, FAQ, artículos y otros bloques informativos para revisarlos uno por uno; no es una captura exacta de cada pantalla o estado interactivo. Si Administración publicó cambios desde el backend o un navegador conserva datos locales, los textos visibles pueden diferir. Compará la versión pública antes de aprobar cada corrección. Marcá cada texto y escribí la redacción correcta cuando haga falta. <b>Esta ficha no publica cambios.</b></div><div class="toolbar"><button onclick="window.print()">Guardar como PDF / Imprimir</button></div>${sections.join('\n')}</body></html>`;
fs.writeFileSync(output, html, 'utf8');
console.log(output);
