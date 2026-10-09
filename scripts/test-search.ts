import assert from 'node:assert/strict';
import { matchesSearch } from '../src/utils/search';

assert.equal(matchesSearch('gestoría', ['Gestoria administrativa']), true);
assert.equal(matchesSearch('patentamiento,', ['Información sobre el patentamiento.']), true);
assert.equal(matchesSearch('  título   digital  ', ['Título Digital del automotor']), true);
assert.equal(matchesSearch('patentamieno', ['Cómo funciona el patentamiento']), true);
assert.equal(matchesSearch('segro', ['Seguro vigente']), true);
assert.equal(matchesSearch('gestoria, patentamieno', ['Gestoría y patentamiento']), true);
assert.equal(matchesSearch('tasa', ['Casa de repuestos']), false);
assert.equal(matchesSearch('seguro', ['Patentamiento de la unidad']), false);

console.log('Búsqueda flexible: casos verificados.');
