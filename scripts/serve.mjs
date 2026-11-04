/**
 * Servidor HTTP de desarrollo local, no backend de producción.
 * Su validación de rutas impide salir de `dist`; no procesa cuentas ni datos.
 * IndexedDB y service workers requieren contexto web seguro o localhost.
 */
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, sep } from 'node:path';
const base = resolve('dist');
const types = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.webmanifest':'application/manifest+json', '.svg':'image/svg+xml', '.json':'application/json', '.png':'image/png' };
createServer(async (req,res) => {
  try {
    const url = new URL(req.url || '/', 'http://localhost');
    const path = resolve(base, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (path !== base && !path.startsWith(base + sep)) throw Error('Path traversal');
    const info = await stat(path);
    const data = await readFile(info.isDirectory() ? resolve(path,'index.html') : path);
    const ext = (info.isDirectory()?'.html':path.slice(path.lastIndexOf('.')));
    res.writeHead(200, {'Content-Type': types[ext] || 'application/octet-stream', 'Cache-Control':'no-cache'}); res.end(data);
  } catch { res.writeHead(404); res.end('No encontrado'); }
}).listen(Number(process.env.PORT || 4173), '0.0.0.0', () => console.log('Juego: http://localhost:4173'));
