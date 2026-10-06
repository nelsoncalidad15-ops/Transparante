import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';
import { INITIAL_ARTICLES, INITIAL_FAQS, INITIAL_SITE_TEXTS, INITIAL_STAGES } from '../src/data/defaultData';

const root = path.resolve(import.meta.dirname, '..');
const output = path.join(root, 'REVISION_PARA_ADMINISTRACION_2026-10-05.html');
const esc = (value: unknown) => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!);
const field = (label: string, value: unknown) => '<div class="field"><b>' + esc(label) + ':</b> ' + esc(value) + '</div>';
const list = (label: string, values?: string[]) => values?.length ? '<div class="field"><b>' + esc(label) + ':</b><ul>' + values.map(value => '<li>' + esc(value) + '</li>').join('') + '</ul></div>' : '';
const review = '<div class="review">&#9744; Correcto &nbsp; &#9744; Corregir &nbsp; &#9744; Consultar con Administraci\u00f3n<div class="note">Correcci\u00f3n / comentario: .............................................................................................................................<br>.............................................................................................................................................................................</div></div>';
const card = (title: string, body: string, id: string, validation: string) => '<article class="card"><div class="id">' + esc(id) + '</div><h3>' + esc(title) + '</h3><div class="validation"><b>Qu\u00e9 validar:</b> ' + esc(validation) + '</div>' + body + review + '</article>';
const section = (title: string, description: string) => '<h2>' + esc(title) + '</h2><p class="section-note">' + esc(description) + '</p>';
const sections: string[] = [];
const source = (file: string) => ts.createSourceFile(file, fs.readFileSync(path.join(root, file), 'utf8'), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
function objectArray(file: string, name: string): Array<Record<string, string>> {
  const ast = source(file), items: Array<Record<string, string>> = [];
  const visit = (node: ts.Node) => {
    if (ts.isVariableDeclaration(node) && node.name.getText(ast) === name && node.initializer && ts.isArrayLiteralExpression(node.initializer)) for (const value of node.initializer.elements) if (ts.isObjectLiteralExpression(value)) {
      const item: Record<string, string> = {};
      for (const prop of value.properties) if (ts.isPropertyAssignment(prop) && (ts.isStringLiteralLike(prop.initializer) || ts.isNumericLiteral(prop.initializer))) item[prop.name.getText(ast).replace(/^['"]|['"]$/g, '')] = prop.initializer.text;
      items.push(item);
    }
    ts.forEachChild(node, visit);
  }; visit(ast); return items;
}
function jsxTexts(file: string) {
  const ast = source(file), values = new Set<string>();
  const visit = (node: ts.Node) => { if (ts.isJsxText(node)) { const text = node.getText(ast).replace(/\s+/g, ' ').trim(); if (text.length > 2) values.add(text); } ts.forEachChild(node, visit); };
  visit(ast); return [...values];
}

sections.push('<h2>C\u00f3mo usar esta ficha</h2><div class="guide"><p><b>Objetivo:</b> confirmar que cada texto publicado describe el proceso real de Autosol Jujuy. Revisen bloque por bloque y dejen por escrito lo que deba confirmar otra \u00e1rea.</p><ol><li><b>Le\u00e9 el t\u00edtulo:</b> indica d\u00f3nde aparece el contenido en la web.</li><li><b>Le\u00e9 “Qu\u00e9 validar”:</b> explica, en palabras simples, qu\u00e9 dato debe confirmar Administraci\u00f3n.</li><li><b>Marc\u00e1 Correcto</b> si el texto se puede publicar tal como est\u00e1; <b>Corregir</b> si hay que reemplazarlo; o <b>Consultar</b> si depende de otra \u00e1rea o una norma vigente.</li><li><b>Escrib\u00ed el texto final o el dato concreto</b> en el comentario. No aprueben plazos, montos, formularios o requisitos sin una fuente interna actualizada.</li></ol><p><b>Campos:</b> “Resumen” es la frase corta que ver\u00e1 el cliente; “Explicaci\u00f3n” la ampl\u00eda; “Qu\u00e9 sucede” enumera acciones internas; “Qu\u00e9 ten\u00e9s que hacer” indica la acci\u00f3n del cliente; “Plazo publicado” es el tiempo informado; “Factores” son causas que pueden modificarlo; “Qu\u00e9 sigue” conecta con la etapa posterior.</p></div>');
const stageCheck = 'Confirmar qu\u00e9 evento inicia y termina esta etapa, qui\u00e9n la actualiza y si el texto, el plazo y las excepciones coinciden con el procedimiento real.';
sections.push(section('1. Etapas del proceso (7)', 'Son los estados que el cliente ve mientras avanza la compra de su 0 km. Validar el orden, el responsable, el disparador y cualquier plazo o requisito informado.'));
for (const stage of INITIAL_STAGES) sections.push(card(String(stage.stepNumber) + '. ' + stage.name, field('Resumen', stage.shortDesc) + field('Explicaci\u00f3n', stage.definition) + list('Qu\u00e9 sucede', stage.whatHappens) + field('Plazo publicado', stage.estimatedTime) + field('Aclaraci\u00f3n del plazo', stage.timeDisclaimer) + list('Factores', stage.timeFactors) + field('Qu\u00e9 sigue', stage.nextStep), 'Etapa ' + stage.id, stageCheck));
sections.push(section('2. Preguntas frecuentes (' + INITIAL_FAQS.length + ')', 'Son respuestas cortas para dudas habituales. Deben ser claras, vigentes y aplicables a la mayor\u00eda de los casos; si depende de una operaci\u00f3n puntual, debe indicarlo.'));
for (const faq of INITIAL_FAQS) sections.push(card(faq.question, field('Respuesta', faq.answer) + field('Categor\u00eda', faq.category), faq.id, 'Confirmar que la respuesta sea cierta hoy, que no prometa condiciones generales y que indique cu\u00e1ndo el cliente debe consultar su caso.'));
sections.push(section('3. Art\u00edculos de la biblioteca (' + INITIAL_ARTICLES.length + ')', 'Son gu\u00edas detalladas. Complementan las etapas y deben usar la misma terminolog\u00eda, requisitos y plazos.'));
for (const article of INITIAL_ARTICLES) sections.push(card(article.title, field('Resumen', article.shortDesc) + field('Definici\u00f3n', article.definition) + list('Qu\u00e9 sucede', article.whatHappens) + field('Plazo publicado', article.estimatedTime || '') + list('Factores', article.timeFactors) + field('Qu\u00e9 sigue', article.whatNext || ''), article.slug, 'Comparar con las etapas y las FAQ: la explicaci\u00f3n no debe introducir requisitos, plazos o promesas diferentes.'));
sections.push(section('4. Textos configurados de la portada y contacto', 'Son mensajes de presentaci\u00f3n, llamados a la acci\u00f3n y datos para contactar a Autosol. Deben reflejar canales, horarios y compromisos comerciales actuales.'));
for (const item of INITIAL_SITE_TEXTS.filter(item => item.active)) sections.push(card(item.label, field('Texto', item.value), item.key, 'Confirmar que el dato, el tono y la promesa comercial siguen vigentes.'));
const structured = [['Documentaci\u00f3n, persona f\u00edsica', 'src/components/DocumentsView.tsx', 'docsFisica'], ['Documentaci\u00f3n, persona jur\u00eddica', 'src/components/DocumentsView.tsx', 'docsJuridica'], ['Preparaci\u00f3n y entrega', 'src/components/DeliveryView.tsx', 'deliverySteps'], ['Checklist de entrega', 'src/components/DeliveryView.tsx', 'clientChecklist'], ['Diccionario', 'src/components/DictionaryView.tsx', 'termsData']] as const;
sections.push(section('5. Tarjetas y listas de las secciones', 'Son listas pr\u00e1cticas sobre documentaci\u00f3n, entrega y t\u00e9rminos. No deben presentar casos especiales como obligatorios para todos.'));
for (const [heading, file, variableName] of structured) {
  sections.push('<h3 class="group">' + esc(heading) + '</h3>');
  for (const [index, item] of objectArray(file, variableName).entries()) {
    const title = item.title || item.term || item.text || 'Elemento ' + (index + 1);
    const body = Object.entries(item).filter(([key]) => !['id', 'title', 'term', 'text', 'pastelBadge', 'statusColor', 'icon'].includes(key)).map(([key, value]) => field(key, value)).join('');
    sections.push(card(title, body, variableName + ' ' + (index + 1), 'Confirmar si aplica a todos los clientes o solo a determinados casos, y explicar los t\u00e9rminos t\u00e9cnicos cuando sea necesario.'));
  }
}
const visible = [['Portada', 'src/components/HeroSection.tsx'], ['Proceso', 'src/components/ProcessTimeline.tsx'], ['Documentaci\u00f3n', 'src/components/DocumentsView.tsx'], ['Tiempos', 'src/components/TimesSection.tsx'], ['Financiaci\u00f3n', 'src/components/FinancingView.tsx'], ['Entrega', 'src/components/DeliveryView.tsx'], ['Diccionario', 'src/components/DictionaryView.tsx'], ['Biblioteca', 'src/components/LibraryView.tsx'], ['Detalle de art\u00edculo', 'src/components/ArticleDetail.tsx'], ['Preguntas frecuentes', 'src/components/FAQSection.tsx'], ['Pie y contacto', 'src/App.tsx']] as const;
sections.push(section('6. Otros textos visibles fijos', 'Son frases de botones, avisos, t\u00edtulos y ayudas que tambi\u00e9n ve el cliente. Deben coincidir con el proceso y los canales reales.'));
for (const [heading, file] of visible) {
  sections.push('<h3 class="group">' + esc(heading) + '</h3>');
  for (const [index, value] of jsxTexts(file).entries()) sections.push(card('Texto ' + (index + 1), field('Publicado', value), file, 'Confirmar que este mensaje es comprensible, vigente y consistente con los datos aprobados en el resto de la ficha.'));
}

const css = '@page{size:A4;margin:16mm}body{font-family:Arial,sans-serif;color:#152536;line-height:1.4;max-width:900px;margin:25px auto;padding:0 20px}h1{color:#002244;font-size:26px}h2{color:#002244;border-bottom:2px solid #002244;padding-bottom:8px;margin-top:36px;break-after:avoid}h3{font-size:17px;margin:0 0 8px}.section-note{background:#f7fafc;border-left:3px solid #6b8499;margin:10px 0 17px;padding:10px 13px;font-size:13px}.guide{background:#eef5f8;border:1px solid #c8d9e2;border-radius:9px;padding:13px 16px;font-size:13px}.guide p{margin:7px 0}.guide ol{margin:8px 0 8px 20px;padding:0}.guide li{margin:5px 0}.card{border:1px solid #cbd3db;border-radius:9px;padding:14px 17px;margin:15px 0;break-inside:avoid}.id{font-size:10px;color:#606b76;margin-bottom:4px}.validation{background:#fff8e6;border-left:3px solid #d69e2e;margin:8px 0 10px;padding:7px 9px;font-size:12px}.field{margin:7px 0;white-space:pre-wrap;font-size:13px}.field b{color:#002244}ul{margin:4px 0 4px 19px;padding:0}li{margin:3px 0}.review{border-top:1px solid #ddd;margin-top:12px;padding-top:9px;font-size:12px}.note{line-height:2;color:#666}.intro{background:#f1f5f8;border-left:4px solid #002244;padding:13px 16px;font-size:13px}.toolbar{margin:18px 0}.toolbar button{background:#002244;color:white;border:0;border-radius:8px;padding:10px 16px;cursor:pointer}@media print{body{margin:0;padding:0;max-width:none}.toolbar{display:none}}';
const intro = '<div class="intro"><b>Base revisada:</b> textos iniciales del c\u00f3digo publicados el 5/10/2026. Esta ficha re\u00fane las etapas, preguntas frecuentes, art\u00edculos y otros bloques para revisarlos uno por uno. Compar\u00e1 la versi\u00f3n p\u00fablica antes de aprobar cada correcci\u00f3n. Esta ficha no publica cambios.</div>';
fs.writeFileSync(output, '<!doctype html><html lang="es"><head><meta charset="utf-8"><title>Ficha de revisi\u00f3n — Autosol Confianza</title><style>' + css + '</style></head><body><h1>Autosol Confianza — ficha de revisi\u00f3n del contenido base</h1>' + intro + '<div class="toolbar"><button onclick="window.print()">Guardar como PDF / Imprimir</button></div>' + sections.join('\n') + '</body></html>', 'utf8');
console.log(output);
