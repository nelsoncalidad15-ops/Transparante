import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = path.resolve(import.meta.dirname, '..');
const scratch = path.join(root, 'scratch');
fs.mkdirSync(scratch, { recursive: true });
const transpile = (file) => ts.transpileModule(fs.readFileSync(path.join(root, file), 'utf8'), {
  fileName: file,
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
}).outputText;

const dataPath = path.join(scratch, 'review-default-data.mjs');
const packetPath = path.join(scratch, 'review-packet-generator.mjs');
fs.writeFileSync(dataPath, transpile('src/data/defaultData.ts'), 'utf8');
fs.writeFileSync(packetPath, transpile('scripts/generate-review-packet.ts').replace('../src/data/defaultData', './review-default-data.mjs').replace("from 'typescript'", "from '../node_modules/typescript/lib/typescript.js'"), 'utf8');
await import(pathToFileURL(packetPath).href);
fs.unlinkSync(dataPath);
fs.unlinkSync(packetPath);
