/**
 * Pruebas del acompañamiento pedagógico v0.7.
 * El contenido NO debe tener efectos en la economía ni exigir conectividad.
 * La puntuación es responsabilidad del comando transaccional activity.execute.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVITIES, STAGES, activitiesForStage } from '../dist/src/data/catalog.js';
import { LEARNING_STAGES, LEARNING_CHALLENGES, challengeForActivity, validateLearningContent } from '../dist/src/data/learning-path.js';
import { newGame, applyGameAction } from '../dist/src/core/engine-game.js';

test('las 14 etapas tienen un capítulo educativo completo y diferente',()=>{
 assert.equal(LEARNING_STAGES.length,14);
 assert.equal(new Set(LEARNING_STAGES.map(s=>s.chapter)).size,14);
 for(const [index,stage] of LEARNING_STAGES.entries()){
  for(const key of ['chapter','hook','purpose','whatHappens','companion','realWorld','closing']){
   assert.ok(stage[key].length>=20, `Etapa ${index+1}: falta contenido ${key}`);
  }
 }
});

test('cada una de las 84 actividades posee un microdesafío único, resuelto y revisable',()=>{
 assert.equal(STAGES.length,14);
 assert.equal(ACTIVITIES.length,84);
 assert.equal(LEARNING_CHALLENGES.size,84);
 assert.deepEqual(validateLearningContent(),[]);
 for(const activity of ACTIVITIES){
  const challenge=challengeForActivity(activity.id);
  assert.ok(challenge);
  assert.equal(challenge.activityId,activity.id);
  assert.equal(challenge.options.length,3);
  assert.ok(challenge.options[challenge.correct].trim());
  assert.ok(challenge.hint&&challenge.explanation);
 }
});

test('los retos cambian por etapa y evitan trabajo académico adulto en Kínder',()=>{
 const kinder=activitiesForStage(0).map(a=>challengeForActivity(a.id));
 assert.equal(kinder.length,6);
 assert.ok(kinder.every(x=>x?.scene&&x?.question));
 assert.ok(!JSON.stringify(kinder).toLowerCase().includes('arbitraje'));
 assert.ok(!JSON.stringify(kinder).toLowerCase().includes('revisar manuscrito'));
 assert.ok(challengeForActivity('etapa7-defensa')?.scene.includes('tesis'));
 assert.ok(challengeForActivity('etapa13-vocaciones')?.scene.includes('científica'));
});

test('los aciertos están distribuidos entre las tres posiciones',()=>{
 const counts=[0,0,0];
 for(const challenge of LEARNING_CHALLENGES.values())counts[challenge.correct]++;
 assert.ok(counts.every(x=>x>=20),`Distribución: ${counts}`);
});

test('consultar o explorar desafíos es puro y no modifica un guardado ni concede puntos',()=>{
 const partida=newGame('Curiosín','biologia');
 const previous=structuredClone(partida);
 for(const activity of ACTIVITIES){
  const challenge=challengeForActivity(activity.id);
  assert.ok(challenge?.options[challenge.correct]);
 }
 assert.deepEqual(partida,previous);
 assert.equal(partida.actions,0);
 assert.equal(partida.stageXp,0);
});

test('tras el reto, las recompensas siguen dependiendo del comando de actividad',()=>{
 const initial=newGame('Taller');
 const activity=activitiesForStage(0)[0];
 const challenge=challengeForActivity(activity.id);
 assert.ok(challenge);
 assert.equal(initial.stageXp,0);
 const result=applyGameAction(initial,'activity.execute',{activityId:activity.id},new Date());
 assert.ok(result.next.stageXp>0);
 assert.equal(initial.stageXp,0);
});
