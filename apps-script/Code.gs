/**
 * Backend de Google Sheets para Autosol Transparente.
 * Configurá SHEET_ID y BACKEND_SHARED_SECRET en Project Settings > Script properties.
 * Desplegá como Web app: Execute as "Me". No compartas el Sheet ni esta URL con el frontend.
 */

function doGet(e) {
  return json_({
    ok: true,
    message: 'Backend de Google Sheets para Autosol Transparente activo.',
    updatedAt: new Date().toISOString()
  });
}

function doPost(e) {
  try {
    var request = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (!isAuthorized_(request.secret)) return json_({ ok: false, error: 'No autorizado.' });
    var action = request.action;
    var payload = request.payload || {};

    if (action === 'getPublicContent') return json_({ ok: true, data: getPublicContent_() });
    if (action === 'getAdminContent') return json_({ ok: true, data: getAdminContent_() });
    if (action === 'getReview') return json_({ ok: true, data: getReview_() });
    if (action === 'updateReview') return json_({ ok: true, data: updateReview_(payload) });
    if (action === 'publishReview') return json_({ ok: true, data: publishReview_(payload) });
    if (action === 'getStages') return json_({ ok: true, data: { stages: readRows_('Etapas') } });
    if (action === 'updateStages') return json_({ ok: true, data: updateStages_(payload) });
    if (action === 'getFaqs') return json_({ ok: true, data: { faqs: readRows_('Preguntas') } });
    if (action === 'updateFaqs') return json_({ ok: true, data: updateFaqs_(payload) });
    if (action === 'getSiteTexts') return json_({ ok: true, data: { texts: readRows_('Textos') } });
    if (action === 'updateSiteTexts') return json_({ ok: true, data: updateSiteTexts_(payload) });
    if (action === 'getIndicators') return json_({ ok: true, data: getIndicators_() });
    if (action === 'getClientCases') return json_({ ok: true, data: getClientCases_() });
    if (action === 'getCaseTimings') return json_({ ok: true, data: getCaseTimings_() });
    if (action === 'updateCaseTimings') return json_({ ok: true, data: updateCaseTimings_(payload) });
    if (action === 'updateContent') return json_({ ok: true, data: updateContent_(payload) });
    return json_({ ok: false, error: 'Acción no reconocida.' });
  } catch (error) {
    console.error(error);
    return json_({ ok: false, error: 'No se pudo procesar la solicitud.' });
  }
}

function isAuthorized_(secret) {
  var expected = PropertiesService.getScriptProperties().getProperty('BACKEND_SHARED_SECRET');
  return !!expected && typeof secret === 'string' && secret === expected;
}

function getSpreadsheet_() {
  var id = PropertiesService.getScriptProperties().getProperty('SHEET_ID');
  if (!id) throw new Error('Falta la propiedad SHEET_ID.');
  return SpreadsheetApp.openById(id);
}

function readRows_(sheetName) {
  var sheet = getSpreadsheet_().getSheetByName(sheetName);
  if (!sheet || sheet.getLastRow() < 2) return [];
  var values = sheet.getDataRange().getValues();
  var headers = values.shift().map(String);
  return values.filter(function(row) { return row.some(function(cell) { return cell !== ''; }); }).map(function(row) {
    return headers.reduce(function(item, header, index) {
      var value = row[index];
      if (['relatedTopics', 'timeFactors', 'whatHappens'].indexOf(header) >= 0 && typeof value === 'string') value = value ? value.split('|').map(function(v) { return v.trim(); }) : [];
      item[header] = value;
      return item;
    }, {});
  });
}

function getPublicContent_() {
  var articles = readRows_('Articulos');
  var stages = readRows_('Etapas').filter(function(stage) { return String(stage.active).toLowerCase() !== 'false'; });
  var texts = readRows_('Textos').filter(function(text) { return String(text.active).toLowerCase() !== 'false'; });
  return { articles: articles, faqs: readRows_('Preguntas'), stages: stages, texts: texts, updatedAt: new Date().toISOString() };
}

function getAdminContent_() {
  return { articles: readRows_('Articulos'), faqs: readRows_('Preguntas'), stages: readRows_('Etapas'), texts: readRows_('Textos'), updatedAt: new Date().toISOString() };
}

function getReview_() {
  var stages = readRows_('RevisionEtapas');
  var faqs = readRows_('RevisionPreguntas');
  return { stages: stages.length ? stages : readRows_('Etapas'), faqs: faqs.length ? faqs : readRows_('Preguntas'), validations: readRows_('Revision'), updatedAt: new Date().toISOString() };
}

function replaceReviewSheet_(name, headers, items) {
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName(name) || ss.insertSheet(name);
  var rows = items.map(function(item) {
    return headers.map(function(header) {
      var value = item[header] === undefined ? '' : item[header];
      return Array.isArray(value) ? value.join('|') : value;
    });
  });
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
}

function updateReview_(payload) {
  if (!payload || !Array.isArray(payload.stages) || !Array.isArray(payload.faqs) || !Array.isArray(payload.validations)) throw new Error('Revisión incompleta.');
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    replaceReviewSheet_('RevisionEtapas', ['id', 'stepNumber', 'name', 'shortDesc', 'definition', 'whatHappens', 'estimatedTime', 'timeDisclaimer', 'timeFactors', 'nextStep', 'iconName', 'category', 'active'], payload.stages);
    replaceReviewSheet_('RevisionPreguntas', ['id', 'question', 'answer', 'category', 'stageId', 'relatedArticleSlug', 'order', 'viewsCount'], payload.faqs);
    replaceReviewSheet_('Revision', ['id', 'status', 'note', 'reviewedAt'], payload.validations);
    return { saved: true, updatedAt: new Date().toISOString() };
  } finally {
    lock.releaseLock();
  }
}

function updateFaqs_(payload) {
  if (!payload || !Array.isArray(payload.faqs)) throw new Error('Faltan las preguntas.');
  replaceReviewSheet_('Preguntas', ['id', 'question', 'answer', 'category', 'stageId', 'relatedArticleSlug', 'order', 'viewsCount'], payload.faqs);
  return { faqs: payload.faqs };
}

function publishReview_(payload) {
  if (!payload || !Array.isArray(payload.stages) || !Array.isArray(payload.faqs) || !Array.isArray(payload.validations)) throw new Error('Revisión incompleta.');
  var required = payload.stages.map(function(item) { return 'stage:' + item.id; }).concat(payload.faqs.map(function(item) { return 'faq:' + item.id; }), ['topic:documentacion', 'topic:pagos', 'topic:plazo-total', 'topic:pdi', 'topic:entrega']);
  var approved = {};
  payload.validations.forEach(function(item) { if (item.status === 'validado') approved[item.id] = true; });
  if (required.some(function(id) { return !approved[id]; })) throw new Error('Todavía hay temas pendientes de validación.');
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    replaceReviewSheet_('RevisionEtapas', ['id', 'stepNumber', 'name', 'shortDesc', 'definition', 'whatHappens', 'estimatedTime', 'timeDisclaimer', 'timeFactors', 'nextStep', 'iconName', 'category', 'active'], payload.stages);
    replaceReviewSheet_('RevisionPreguntas', ['id', 'question', 'answer', 'category', 'stageId', 'relatedArticleSlug', 'order', 'viewsCount'], payload.faqs);
    replaceReviewSheet_('Revision', ['id', 'status', 'note', 'reviewedAt'], payload.validations);
    replaceReviewSheet_('Etapas', ['id', 'stepNumber', 'name', 'shortDesc', 'definition', 'whatHappens', 'estimatedTime', 'timeDisclaimer', 'timeFactors', 'nextStep', 'iconName', 'category', 'active'], payload.stages);
    replaceReviewSheet_('Preguntas', ['id', 'question', 'answer', 'category', 'stageId', 'relatedArticleSlug', 'order', 'viewsCount'], payload.faqs);
    return { published: true, updatedAt: new Date().toISOString() };
  } finally { lock.releaseLock(); }
}

function updateSiteTexts_(payload) {
  if (!payload || !Array.isArray(payload.texts)) throw new Error('Faltan los textos.');
  var sheet = getSpreadsheet_().getSheetByName('Textos') || getSpreadsheet_().insertSheet('Textos');
  var headers = ['key', 'section', 'label', 'value', 'description', 'active'];
  var rows = payload.texts.map(function(text) { return headers.map(function(header) { return text[header] === undefined ? '' : text[header]; }); });
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  return { texts: payload.texts };
}

function updateStages_(payload) {
  if (!payload || !Array.isArray(payload.stages)) throw new Error('Faltan las etapas.');
  var sheet = getSpreadsheet_().getSheetByName('Etapas') || getSpreadsheet_().insertSheet('Etapas');
  var headers = ['id', 'stepNumber', 'name', 'shortDesc', 'definition', 'whatHappens', 'estimatedTime', 'timeDisclaimer', 'timeFactors', 'nextStep', 'iconName', 'category', 'active'];
  var rows = payload.stages.map(function(stage) {
    return headers.map(function(header) {
      var value = stage[header] === undefined ? '' : stage[header];
      return Array.isArray(value) ? value.join('|') : value;
    });
  });
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  if (rows.length) sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  return { stages: payload.stages };
}

function getIndicators_() {
  var rows = readRows_('Indicadores');
  return { indicators: rows, updatedAt: new Date().toISOString() };
}

function normalizeHeader_(value) {
  return String(value || '').toLowerCase().replace(/[áàäâ]/g, 'a').replace(/[éèëê]/g, 'e').replace(/[íìïî]/g, 'i').replace(/[óòöô]/g, 'o').replace(/[úùüû]/g, 'u').replace(/ñ/g, 'n').replace(/[^a-z0-9]/g, '');
}

function field_(row, name) {
  var expected = normalizeHeader_(name);
  var keys = Object.keys(row);
  for (var i = 0; i < keys.length; i++) if (normalizeHeader_(keys[i]) === expected) return row[keys[i]];
  return '';
}

function formatDate_(value) {
  if (!value) return '';
  if (Object.prototype.toString.call(value) === '[object Date]' && !isNaN(value.getTime())) return Utilities.formatDate(value, Session.getScriptTimeZone(), 'yyyy-MM-dd');
  return String(value);
}

function getClientCases_() {
  // La exportación operativa puede llamarse Agenda o Operaciones.
  // Se prioriza Agenda para usar la hoja actual del equipo sin renombrarla.
  var rows = readRows_('Agenda');
  if (!rows.length) rows = readRows_('Operaciones');
  return {
    cases: rows.map(function(row, index) {
      return {
        id: String(field_(row, 'N° Operación') || field_(row, 'Interno') || index + 1),
        clientName: String(field_(row, 'Cliente')),
        phone: String(field_(row, 'Teléfono')),
        vehicleModel: String(field_(row, 'Modelo')),
        currentStatus: String(field_(row, 'Ultimo Estado')),
        invoiceDate: formatDate_(field_(row, 'Fecha Facturación')),
        appointmentDate: formatDate_(field_(row, 'Fecha Gestión Turno')),
        lastModifiedDate: formatDate_(field_(row, 'Fecha Últ Modificación')),
        operationNumber: String(field_(row, 'N° Operación')),
        advisor: String(field_(row, 'Gestionado por'))
      };
    }).filter(function(item) { return item.clientName && item.currentStatus && item.currentStatus.toLowerCase() !== 'entregado'; }),
    updatedAt: new Date().toISOString()
  };
}

function defaultCaseTimings_() {
  return [
    { key: 'facturado', label: 'Facturado → Patentado', description: 'Desde Fecha Facturación', warningDays: 10, limitDays: 15, message: 'Hola {cliente}, te escribimos de Autosol por tu {modelo}. Estamos avanzando con la gestión de patentamiento y queremos mantenerte informado. Ante cualquier consulta, estamos a disposición.' },
    { key: 'patentado', label: 'Patentado → Turno', description: 'Desde Fecha Últ Modificación', warningDays: 4, limitDays: 7, message: 'Hola {cliente}, tu {modelo} ya se encuentra patentado. Estamos coordinando los próximos pasos para tu entrega y te mantendremos informado/a.' },
    { key: 'preturno', label: 'Preturno → Turno', description: 'Desde Fecha Últ Modificación', warningDays: 3, limitDays: 5, message: 'Hola {cliente}, estamos en la etapa final de preparación de tu {modelo}. En breve vamos a contactarte para coordinar el turno de entrega.' },
    { key: 'turno', label: 'Turno → Entrega', description: 'Desde Fecha Gestión Turno', warningDays: 2, limitDays: 3, message: 'Hola {cliente}, queremos confirmar el avance de la entrega de tu {modelo}. Estamos revisando el turno y te informaremos la próxima novedad a la brevedad.' }
  ];
}

function getCaseTimings_() {
  var sheet = getSpreadsheet_().getSheetByName('Configuracion semaforo');
  if (!sheet || sheet.getLastRow() < 2) return { timings: defaultCaseTimings_() };
  var rows = readRows_('Configuracion semaforo');
  return { timings: rows.map(function(row) {
    return { key: String(row.key), label: String(row.label), description: String(row.description), warningDays: Number(row.warningDays), limitDays: Number(row.limitDays), message: String(row.message) };
  }).filter(function(item) { return item.key; }) };
}

function updateCaseTimings_(payload) {
  if (!payload || !Array.isArray(payload.timings)) throw new Error('Faltan los tiempos del semáforo.');
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName('Configuracion semaforo') || ss.insertSheet('Configuracion semaforo');
  sheet.clearContents();
  var headers = ['key', 'label', 'description', 'warningDays', 'limitDays', 'message'];
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  var values = payload.timings.map(function(item) { return headers.map(function(header) { return item[header] === undefined ? '' : item[header]; }); });
  if (values.length) sheet.getRange(2, 1, values.length, headers.length).setValues(values);
  return { timings: payload.timings };
}

function updateContent_(payload) {
  if (!payload || !payload.operation || !payload.article) throw new Error('Faltan datos de contenido.');
  var ss = getSpreadsheet_();
  var sheet = ss.getSheetByName('Articulos');
  var defaultHeaders = ['id', 'slug', 'title', 'category', 'type', 'shortDesc', 'definition', 'whatHappens', 'estimatedTime', 'timeFactors', 'whatNext', 'relatedTopics', 'readTimeMinutes', 'status', 'lastReview', 'responsible', 'version', 'viewsCount', 'helpfulCount', 'unhelpfulCount', 'deleted'];
  if (!sheet) {
    sheet = ss.insertSheet('Articulos');
    sheet.getRange(1, 1, 1, defaultHeaders.length).setValues([defaultHeaders]);
  }
  var lastCol = sheet.getLastColumn();
  var headers = lastCol > 0 ? sheet.getRange(1, 1, 1, lastCol).getValues()[0].map(String) : defaultHeaders;
  var article = payload.article;
  if (payload.operation === 'delete') {
    article = Object.assign({}, article, { deleted: true, status: 'Desactivado' });
  }
  if (headers.indexOf('deleted') < 0) { sheet.getRange(1, headers.length + 1).setValue('deleted'); headers.push('deleted'); }
  var row = headers.map(function(header) {
    var value = article[header] === undefined ? '' : article[header];
    return Array.isArray(value) ? value.join('|') : value;
  });
  var idColumn = headers.indexOf('id');
  var existingRows = sheet.getDataRange().getValues();
  for (var index = 1; index < existingRows.length; index++) {
    if (idColumn >= 0 && String(existingRows[index][idColumn]) === String(article.id)) { sheet.getRange(index + 1, 1, 1, headers.length).setValues([row]); return { updated: true }; }
  }
  sheet.appendRow(row);
  return { created: true };
}

function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
