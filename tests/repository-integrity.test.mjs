/**
 * @file Pruebas de integridad para entregar Academic Pet a otras personas.
 * No sustituyen pruebas de pantalla: verifican recursos, enlaces y áreas.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { AREAS } from '../dist/src/data/catalog.js';
import { PET_KINDS } from '../dist/src/data/pet-visuals.js';
const root=resolve(dirname(new URL(import.meta.url).pathname),'..');
const read=path=>readFileSync(join(root,path),'utf8');
function checkLinks(file){
 for(const m of read(file).matchAll(/\[[^\]]+\]\(([^)]+)\)/g)){
  const href=m[1].split('#')[0];
  if(!href||/^(?:https?:|mailto:|\/\/)/i.test(href))continue;
  assert.ok(existsSync(resolve(root,dirname(file),decodeURIComponent(href))),file+' enlaza a '+href);
 }
}
test('los recursos precargados existen y contienen las nueve mascotas',()=>{
 const declaration=read('public/sw.js').match(/const SHELL\s*=\s*\[([\s\S]*?)\];/);
 assert.ok(declaration);
 const paths=[...declaration[1].matchAll(/'([^']+)'/g)].map(m=>m[1]);
 assert.ok(paths.length>=30);
 assert.equal(new Set(paths).size,paths.length);
 for(const path of paths){
  assert.ok(path.startsWith('./'));
  assert.ok(existsSync(join(root,'dist',path==='./'?'index.html':path.slice(2))),'Falta precarga: '+path);
 }
 for(const [id] of AREAS)assert.ok(paths.includes('./pets/'+id+'.svg'),'Falta '+id);
});
test('las nueve áreas tienen IDs, sprites y selector consistente',()=>{
 assert.equal(AREAS.length,9);
 const ids=new Set(AREAS.map(([id])=>id));
 assert.deepEqual(ids,new Set(Object.keys(PET_KINDS)));
 assert.match(read('src/ui/app.ts'),/AREAS\.map\(/);
 for(const id of ids)assert.ok(existsSync(join(root,'public/pets',id+'.svg')));
});
test('la documentación técnica y la matriz de requisitos tienen enlaces internos válidos',()=>{
 const docs=['README.md','CONTRIBUTING.md','CONTINUAR_EN_CODEX_O_WORK.md','docs/README.md','src/data/README.md','src/ui/README.md','tests/PLAN.md'];
 for(const folder of ['01-proyecto','02-juego','03-tecnica','04-calidad','05-publicacion','06-normativa']){
  for(const file of readdirSync(join(root,'docs',folder)))if(file.endsWith('.md'))docs.push('docs/'+folder+'/'+file);
 }
 for(const file of docs)checkLinks(file);
 assert.ok(docs.length>=20);
 assert.match(read('docs/01-proyecto/AUDITORIA_CUMPLIMIENTO_2026_11_06.md'),/Mínimo de un día real por etapa/);
});
