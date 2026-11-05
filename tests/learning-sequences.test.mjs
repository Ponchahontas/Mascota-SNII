/** Pruebas de progresión educativa v0.8; no dependen del DOM ni de navegador. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVITIES, STAGES } from '../dist/src/data/catalog.js';
import { STEP_COUNT, learningSequence, validateLearningSequences, masteredSteps } from '../dist/src/data/learning-sequences.js';
import { STAGE_SCENES, stationIndex } from '../dist/src/data/scene-world.js';
import { newGame, applyGameAction } from '../dist/src/core/engine-game.js';
import { validateSave } from '../dist/src/core/persistence.js';

const newState=()=>newGame('Curiosín','biologia');
const first=ACTIVITIES[0];
const complete=(state,activity=first)=>{
 let current=state;
 for(const step of learningSequence(activity.id)){
  current=applyGameAction(current,'learning.answer',{activityId:activity.id,stepIndex:step.stepIndex,answer:step.correct}).next;
 }
 return current;
};

test('84 aventuras tienen cinco pasos: 420 posiciones y no repiten pregunta dentro de una aventura',()=>{
 assert.equal(ACTIVITIES.length,84);assert.equal(STEP_COUNT,5);
 assert.deepEqual(validateLearningSequences(),[]);
 assert.equal(ACTIVITIES.flatMap(a=>learningSequence(a.id)).length,420);
 for(const a of ACTIVITIES){
  const seq=learningSequence(a.id);
  assert.equal(new Set(seq.map(x=>x.question)).size,5);
  assert.ok(seq.every(x=>x.options[x.correct]&&x.explanation&&x.hint));
 }
});

test('el primer módulo de Kínder tiene cinco preguntas, cinco respuestas y explicaciones propias',()=>{
 const q=learningSequence('etapa0-colores');
 assert.equal(q.length,5);
 assert.ok(q.some(x=>x.question.includes('tres lados')));
 assert.ok(q.some(x=>x.question.includes('mismo color')));
 assert.notEqual(q[1].scene,q[2].scene);
});

test('no es posible saltar pasos, usar respuestas falsas o inscribir otra etapa',()=>{
 const state=newState(),q=learningSequence(first.id);
 assert.throws(()=>applyGameAction(state,'learning.answer',{activityId:first.id,stepIndex:1,answer:q[1].correct}),/paso anterior/);
 assert.throws(()=>applyGameAction(state,'learning.answer',{activityId:first.id,stepIndex:0,answer:(q[0].correct+1)%3}),/no es correcta/);
 assert.throws(()=>applyGameAction(state,'learning.answer',{activityId:'etapa7-defensa',stepIndex:0,answer:0}),/no corresponde/);
 assert.equal(state.stageXp,0);assert.equal(state.ap,STAGES[0].maxAP);
});

test('los cinco aciertos quedan guardados con cero consumo de PA o UPE; repetir antes está bloqueado',()=>{
 const start=newState();
 assert.throws(()=>applyGameAction(start,'activity.execute',{activityId:first.id,practiceMode:'repeat'}),/cinco desafíos/);
 const done=complete(start);
 assert.deepEqual(done.learningProgress[first.id],[0,1,2,3,4]);
 assert.equal(masteredSteps(done.learningProgress,first.id),5);
 assert.equal(done.ap,start.ap);assert.equal(done.stageXp,0);assert.equal(done.credits,start.credits);
 assert.deepEqual(start.learningProgress,{});
 assert.ok(validateSave(done));
});

test('volver a registrar un paso no da beneficios ni incrementa las respuestas',()=>{
 const firstQuestion=learningSequence(first.id)[0];
 const firstState=applyGameAction(newState(),'learning.answer',{activityId:first.id,stepIndex:0,answer:firstQuestion.correct}).next;
 const repeated=applyGameAction(firstState,'learning.answer',{activityId:first.id,stepIndex:0,answer:firstQuestion.correct}).next;
 assert.deepEqual(repeated.learningProgress[first.id],[0]);
 assert.equal(repeated.stageXp,0);assert.equal(repeated.ap,STAGES[0].maxAP);
});

test('primera práctica guiada ofrece bono una sola vez y repeticiones cuestan PA',()=>{
 const base=newState(),done=complete(base);
 const firstPractice=applyGameAction(done,'activity.execute',{activityId:first.id,practiceMode:'guided'}).next;
 assert.ok(firstPractice.stageXp>0);assert.ok(firstPractice.ap<done.ap);
 assert.deepEqual(firstPractice.learningRewarded,[first.id]);
 // Comparar con la misma partida sin bono usando el modo repeat.
 const sameNoBonus=applyGameAction(done,'activity.execute',{activityId:first.id,practiceMode:'repeat'}).next;
 assert.ok(firstPractice.stageXp>=sameNoBonus.stageXp);
 const nextPractice=applyGameAction(firstPractice,'activity.execute',{activityId:first.id,practiceMode:'guided'}).next;
 assert.equal(nextPractice.learningRewarded.length,1);
 assert.ok(nextPractice.ap<firstPractice.ap);
});

test('partidas v0.7 sin campos nuevos siguen siendo válidas y se actualizan por lectura',()=>{
 const old=newState();delete old.learningProgress;delete old.learningRewarded;
 assert.ok(validateSave(old));
 const answer=learningSequence(first.id)[0];
 const migrated=applyGameAction(old,'learning.answer',{activityId:first.id,stepIndex:0,answer:answer.correct}).next;
 assert.deepEqual(migrated.learningProgress[first.id],[0]);
 assert.ok(validateSave(migrated));
});

test('se rechazan progresos manipulados o corruptos en JSON',()=>{
 const state=newState();
 for(const invalid of [[0,0],[1],[0,4],[0,1,2,3,4,5],[-1]]){
  const modified=structuredClone(state);modified.learningProgress={[first.id]:invalid};
  assert.equal(validateSave(modified),false,JSON.stringify(invalid));
 }
});

test('cada etapa tiene un paisaje y seis estaciones con destino inequívoco',()=>{
 assert.equal(STAGE_SCENES.length,14);
 for(let i=0;i<14;i++){
  const activities=ACTIVITIES.filter(a=>a.minStage===i);
  assert.equal(activities.length,6);
  assert.ok(STAGE_SCENES[i].title&&STAGE_SCENES[i].ambient);
  for(const [index,a] of activities.entries())assert.equal(stationIndex(i,a.id),index);
 }
});
