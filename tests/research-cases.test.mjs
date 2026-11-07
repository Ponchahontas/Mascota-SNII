/**
 * Revisión de 90 estudios de caso escritos para Universidad→Emérito.
 * No pretende reemplazar la revisión pedagógica de especialistas.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { AREAS } from '../dist/src/data/catalog.js';
import { researchCaseFor,validateResearchCases } from '../dist/src/data/research-cases.js';
import { fieldChallenge } from '../dist/src/data/area-routes.js';
import { newGame,applyGameAction } from '../dist/src/core/engine-game.js';
const ids=AREAS.map(([id])=>id);

test('nueve áreas contienen noventa decisiones propias para las diez etapas avanzadas',()=>{
 assert.deepEqual(validateResearchCases(ids),[]);
 assert.equal(ids.length,9);
 const questions=new Set(),situations=new Set();
 for(const id of ids)for(let i=4;i<=13;i++){
  const study=researchCaseFor(id,i);
  assert.ok(study,`${id} sin etapa ${i}`);
  assert.ok(study[1].length>=25,`${id}:${i}: caso muy breve`);
  assert.ok(!questions.has(study[1]),`${id}:${i}: pregunta repetida`);
  questions.add(study[1]);situations.add(study[0]);
  const q=fieldChallenge(id,i);
  assert.equal(q.question,study[1]);
  assert.ok(q.scene.includes(study[0]));
  assert.ok(q.options.includes(study[2]));
  assert.equal(q.options[q.correct],study[2]);
  assert.equal(q.explanation,study[5]);
 }
 assert.equal(questions.size,90);
 assert.equal(situations.size,90);
});

test('Kínder a Preparatoria mantienen sus preguntas anteriores; no cambia el guardado',()=>{
 for(const id of ids)for(let i=0;i<4;i++){
  assert.equal(researchCaseFor(id,i),null);
  assert.ok(fieldChallenge(id,i).question.includes(fieldChallenge(id,i).title));
 }
 const s=newGame('Investigadora','ingenieria');
 s.stageIndex=6;s.pet.stageId='maestria';s.areaPath='software';
 const correct=fieldChallenge('ingenieria',6,'software').correct;
 const after=applyGameAction(s,'career.completeFieldMission',{answer:correct}).next;
 assert.ok(after.fieldMilestones?.includes(6));
 assert.ok(after.stageXp>s.stageXp);
 assert.equal(after.ap,s.ap);
 const twice=applyGameAction(after,'career.completeFieldMission',{answer:correct}).next;
 assert.equal(twice.totalXp,after.totalXp);
});

test('no se conservan recompensas incorrectas ni se desplazan IDs persistentes',()=>{
 for(const id of ids){
  const study=researchCaseFor(id,7);
  assert.equal(study?.length,7);
  const q=fieldChallenge(id,7);
  assert.ok(q.correct===0||q.correct===1||q.correct===2);
  assert.ok(q.options.every(s=>s.length>=25));
  assert.notEqual(q.options[(q.correct+1)%3],q.options[q.correct]);
 }
});