/**
 * Construcción determinista de la PWA estática.
 * Limpia `dist`, transpila TypeScript a JS, copia HTML/CSS y recursos públicos.
 * No requiere variables secretas ni servicios externos en tiempo de build.
 * Si añade módulos, `public/sw.js` debe conocerlos para permitir uso offline.
 */
import { cp, mkdir, rm } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
await rm('dist', { recursive: true, force: true });
await mkdir('dist/src', { recursive: true });
const result = spawnSync('tsc', ['-p', 'tsconfig.json'], { stdio: 'inherit', shell: process.platform === 'win32' });
if (result.status !== 0) process.exit(result.status || 1);
await cp('index.html', 'dist/index.html');
await cp('src/styles.css', 'dist/src/styles.css');
await cp('public', 'dist', { recursive: true });
console.log('Build OK: dist/');
