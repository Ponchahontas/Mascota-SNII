/**
 * Pruebas de identidad del producto, etiquetas de exportación y compatibilidad.
 * La denominación comercial retirada solo debe sobrevivir como clave técnica
 * histórica en persistencia: nunca debe mostrarse en el juego ni en la PWA.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { newGame } from '../dist/src/core/engine-game.js';
import { EXPORT_APPLICATION, exportSave, parseImport } from '../dist/src/core/persistence.js';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=(path)=>readFileSync(resolve(root,path),'utf8');

test('La página presenta la identidad Academic Pet, sin marca ajena',()=>{
 const index=read('index.html'),app=read('src/ui/app.ts');
 assert.match(index,/<title>Academic Pet \| Una aventura de aprendizaje<\/title>/);
 assert.match(app,/<h1>Academic <em>Pet<\/em><\/h1>/);
 assert.doesNotMatch(index,/tamagotchi/i);
 assert.doesNotMatch(app,/tamagotchi/i);
});

test('El manifiesto conserva la identidad de instalación PWA, pero renombra la aplicación',()=>{
 const manifest=JSON.parse(read('public/manifest.webmanifest'));
 assert.equal(manifest.name,'Academic Pet — Una aventura de aprendizaje');
 assert.equal(manifest.short_name,'Academic Pet');
 assert.equal(manifest.id,'./');
 assert.equal(manifest.start_url,'./');
});

test('Nuevas exportaciones usan Academic Pet y son reimportables',()=>{
 const save=newGame('Curi','biologia');
 const exported=JSON.parse(exportSave(save));
 assert.equal(EXPORT_APPLICATION,'academic-pet');
 assert.equal(exported.application,'academic-pet');
 assert.deepEqual(parseImport(JSON.stringify(exported)),JSON.parse(JSON.stringify(save)));
});

test('Los JSON de versiones anteriores siguen siendo aceptados',()=>{
 const save=newGame('Curi','fisico');
 const previous=JSON.parse(exportSave(save));
 previous.application='tamagotchi-academico';
 assert.deepEqual(parseImport(JSON.stringify(previous)),JSON.parse(JSON.stringify(save)));
 previous.application='producto-incompatible';
 assert.throws(()=>parseImport(JSON.stringify(previous)),/exportación/);
});

test('Se actualiza la caché sin alterar el ámbito de otros sitios',()=>{
 const source=read('public/sw.js');
 assert.match(source,/academic-pet-shell-/);
 assert.match(source,/LEGACY_CACHE_PREFIX/);
 assert.match(source,/k\.startsWith\(CACHE_PREFIX\)\|\|k\.startsWith\(LEGACY_CACHE_PREFIX\)/);
});

test('Metadatos del proyecto y documentos principales usan el nombre correcto',()=>{
 const pkg=JSON.parse(read('package.json'));
 assert.equal(pkg.name,'academic-pet');
 assert.equal(pkg.version,'0.12.0');
 for(const file of ['README.md','PROMPT_MAESTRO_ASTRA.md','docs/README.md']){
  assert.match(read(file),/Academic Pet/i,'Falta identidad en '+file);
  assert.doesNotMatch(read(file),/tamagotchi/i,'Nombre ajeno en '+file);
 }
});
