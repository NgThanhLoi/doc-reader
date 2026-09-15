// Build-time: copy data/**/*.json into public/data/ so the static site can fetch them.
import { readdirSync, mkdirSync, copyFileSync, statSync } from 'fs';
import { join } from 'path';

function copyDir(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const f of readdirSync(src)) {
    const s = join(src, f), d = join(dst, f);
    if (statSync(s).isDirectory()) copyDir(s, d);
    else if (f.endsWith('.json')) copyFileSync(s, d);
  }
}
copyDir(join(process.cwd(), 'data'), join(process.cwd(), 'public', 'data'));
console.log('data copied');
