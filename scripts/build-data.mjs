// Build-time: copy data/*.json into public/data/ so the static site can fetch them.
import { readdirSync, mkdirSync, copyFileSync, statSync } from 'fs';
import { join } from 'path';

const src = join(process.cwd(), 'data');
const dst = join(process.cwd(), 'public', 'data');
mkdirSync(dst, { recursive: true });
for (const f of readdirSync(src)) {
  if (f.endsWith('.json')) copyFileSync(join(src, f), join(dst, f));
}
console.log('data copied:', readdirSync(dst).length, 'files');
