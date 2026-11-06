/**
 * Regresión para el cambio 7→9 áreas. Se revisan 126 evoluciones y misiones,
 * dos ramas por disciplina, persistencia compatible y premios no repetibles.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { AREAS, STAGES } from '../dist/src/data/catalog.js';
import { AREA_ROUTES, fieldChallenge, validateAreaRoutes, branchOf } from '../dist/src/data/area-routes.js';
import { PET_KINDS, petArea, petSprite } from '../dist/src/data/pet-visuals.js';
import { newGame, applyGameAction } from '../dist/src/core/engine-game.js';
import { validateSave } from '../dist/src/core/persistence.js';

const go=(state,type,payload={})=>applyGameAction(state,type,payload).next;
const oldAreas=['fisico','biologia','medicina','humanidades','sociales','agro','ingenieria'];

test('las nueve áreas oficiales tienen personajes, sprites y 14 etapas con rutas temáticas',()=>{
 assert.equal(AREAS.length,9);
 assert.equal(Object.keys(PET_KINDS).length,9);
 assert.deepEqual(Object.keys(AREA_ROUTES).sort(),AREAS.map(([id])=>id).sort());
 assert.deepEqual(validateAreaRoutes(),[]);
 assert.ok(AREAS.some(([id])=>id==='conducta'));
 assert.ok(AREAS.some(([id])=>id==='interdisciplinaria'));
 for(const [id,label] of AREAS){
  assert.equal(petArea(id),id);
  const svg=readFileSync('dist'+petSprite(id).substring(1),'utf8');
  assert.match(svg,/<svg[^>]+width="448" height="32"/);
  assert.ok(svg.length>1000);
  assert.ok(label.length>10);
  assert.equal(AREA_ROUTES[id].themes.length,STAGES.length);
 }
});

test('cada una de las 126 misiones tiene un título, pregunta, opciones y solución verificable',()=>{
 const questions=new Set();
 for(const [id] of AREAS)for(let i=0;i<STAGES.length;i++){
  const q=fieldChallenge(id,i);
  assert.equal(q.stageIndex,i);
  assert.ok(q.question.includes(q.title));
  assert.equal(q.options.length,3);
  assert.ok(q.options[q.correct].length>20);
  assert.ok(q.hint&&q.explanation);
  assert.ok(!questions.has(q.question));questions.add(q.question);
 }
 assert.equal(questions.size,9*14);
});

test('elegir especialización está bloqueado antes de Universidad y valida rama correcta',()=>{
 let state=newGame('Profe','conducta');
 assert.throws(()=>go(state,'career.chooseRoute',{branchId:'educacion'}),/Universidad/);
 state.stageIndex=4;state.pet.stageId=STAGES[4].id;
 assert.throws(()=>go(state,'career.chooseRoute',{branchId:'cosmos'}),/no pertenece/);
 state=go(state,'career.chooseRoute',{branchId:'educacion'});
 assert.equal(branchOf('conducta',state.areaPath).label,'Investigación educativa');
 assert.throws(()=>go(state,'career.chooseRoute',{branchId:'conducta'}),/ya fue elegida/);
 assert.equal(validateSave(state),true);
});

test('misión de campo otorga bono una sola vez y no cobra PA',()=>{
 let s=newGame('Quimera','interdisciplinaria');
 const q=fieldChallenge(s.areaId,0);
 const ap=s.ap,originalXp=s.stageXp;
 assert.throws(()=>go(s,'career.completeFieldMission',{answer:(q.correct+1)%3}),/Puedes volver a intentarlo/);
 assert.equal(s.stageXp,originalXp);
 s=go(s,'career.completeFieldMission',{answer:q.correct});
 assert.equal(s.ap,ap);
 assert.ok(s.stageXp>originalXp);
 assert.deepEqual(s.fieldMilestones,[0]);
 const repeat=go(s,'career.completeFieldMission',{answer:q.correct});
 assert.equal(repeat.totalXp,s.totalXp);
 assert.equal(validateSave(repeat),true);
});

test('misión desde Universidad requiere ruta y conserva estado tras transición',()=>{
 let s=newGame('Quimera','interdisciplinaria');s.stageIndex=4;s.pet.stageId=STAGES[4].id;
 assert.throws(()=>go(s,'career.completeFieldMission',{answer:fieldChallenge('interdisciplinaria',4).correct}),/especialización/);
 s=go(s,'career.chooseRoute',{branchId:'tecnohumanista'});
 const q=fieldChallenge(s.areaId,s.stageIndex,s.areaPath);
 const next=go(s,'career.completeFieldMission',{answer:q.correct});
 assert.equal(next.areaPath,'tecnohumanista');
 assert.ok(next.fieldMilestones.includes(4));
 assert.equal(validateSave(next),true);
});

test('cambio de área conserva progreso anterior y descarta la ruta incompatible',()=>{
 let s=newGame('Antigua','humanidades');s.stageIndex=6;s.areaPath='filosofia';s.fieldMilestones=[0,4];s.stageXp=96;s.credits=88;
 s=go(s,'pet.changeArea',{areaId:'conducta'});
 assert.equal(s.areaId,'conducta');
 assert.equal(s.areaPath,undefined);
 assert.deepEqual(s.fieldMilestones,[0,4]);
 assert.equal(s.stageXp,96);assert.equal(s.credits,88);
 assert.equal(validateSave(s),true);
});

test('partidas antiguas con las siete áreas siguen siendo válidas sin campos nuevos',()=>{
 for(const id of oldAreas){
  const previous=newGame('Partida vieja',id);
  delete previous.areaPath;delete previous.fieldMilestones;
  assert.equal(validateSave(previous),true);
  assert.equal(petArea(previous.areaId),id);
  const next=go(previous,'career.completeFieldMission',{answer:fieldChallenge(id,0).correct});
  assert.equal(next.fieldMilestones.length,1);
 }
});

test('nueve áreas ofrecen 18 finales de ruta diferentes al llegar a Emérito',()=>{
 const endings=new Set();
 for(const [id] of AREAS)for(const branch of AREA_ROUTES[id].branches){
  let s=newGame('Leyenda',id);s.stageIndex=13;s.areaPath=branch.id;s.pet.stageId=STAGES[13].id;
  s=go(s,'career.completeFieldMission',{answer:fieldChallenge(id,13,branch.id).correct});
  assert.ok(s.achievements.includes(`ruta-${id}-${branch.id}`));
  assert.ok(s.history.some(message=>message.includes(branch.ending)));
  endings.add(branch.ending);
 }
 assert.equal(endings.size,18);
});
