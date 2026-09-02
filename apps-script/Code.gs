/**
 * Backend de Google Sheets para Autosol Transparente.
 * Configurá SHEET_ID y BACKEND_SHARED_SECRET en Project Settings > Script properties.
 * Desplegá como Web app: Execute as "Me". No compartas el Sheet ni esta URL con el frontend.
 */

function doPost(e) {
  try {
    var request = JSON.parse((e.postData && e.postData.contents) || '{}');
    if (!isAuthorized_(request.secret)) return json_({ ok: false, error: 'No autorizado.' });
    var action = request.action;
    var payload = request.payload || {};

    if (action === 'getPublicContent') return json_({ ok: true, data: getPublicContent_() });
    if (action === 'getAdminContent') return json_({ ok: true, data: getAdminContent_() });
    if (action === 'getIndicators') return json_({ ok: true, data: getIndicators_() });
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
  var articles = readRows_('Articulos').filter(function(article) { return article.status === 'Publicado'; });
  return { articles: articles, faqs: readRows_('Preguntas'), updatedAt: new Date().toISOString() };
}

function getAdminContent_() {
  return { articles: readRows_('Articulos'), faqs: readRows_('Preguntas'), updatedAt: new Date().toISOString() };
}

function getIndicators_() {
  var rows = readRows_('Indicadores');
  return { indicators: rows, updatedAt: new Date().toISOString() };
}

function updateContent_(payload) {
  if (!payload || !payload.operation || !payload.article) throw new Error('Faltan datos de contenido.');
  var sheet = getSpreadsheet_().getSheetByName('Articulos');
  if (!sheet) throw new Error('No existe la hoja Articulos.');
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(String);
  var article = payload.article;
  if (payload.operation === 'delete') {
    var rows = sheet.getDataRange().getValues();
    for (var rowIndex = 1; rowIndex < rows.length; rowIndex++) if (String(rows[rowIndex][0]) === String(article.id)) { sheet.deleteRow(rowIndex + 1); return { deleted: true }; }
    throw new Error('Contenido no encontrado.');
  }
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
