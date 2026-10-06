import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
for (const extension of ['html', 'pdf']) {
  const filename = 'REVISION_PARA_ADMINISTRACION_2026-10-05.' + extension;
  fs.copyFileSync(path.join(root, filename), path.join(root, 'dist', filename));
}
