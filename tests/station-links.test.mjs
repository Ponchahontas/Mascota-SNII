/**
 * Pruebas de regresión para el bug reportado por una persona jugadora:
 * al tocar una estación (p. ej. «Construir con bloques») el panel no identificaba
 * la aventura y las preguntas 2–5 eran compartidas con actividades diferentes.
 *
 * Estas pruebas no requieren DOM y cubren la tabla de 14 × 6 estaciones.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { ACTIVITIES, STAGES, activitiesForStage } from '../dist/src/data/catalog.js';
import { STEP_COUNT, learningSequence, masteredSteps, validateLearningSequences } from '../dist/src/data/learning-sequences.js';
import { stationsForStage, learningStation, stationIndex, validateStationConnections } from '../dist/src/data/scene-world.js';
import { ACTIVITY_MOMENTS } from '../dist/src/data/activity-extras.js';
import { newGame, applyGameAction } from '../dist/src/core/engine-game.js';

const stages=Array.from({length:STAGES.length},(_,i)=>i);

test('mapa, tarjeta y banco de retos coinciden por activityId en las 84 estaciones',()=>{
 assert.deepEqual(validateStationConnections(STAGES.length),[]);
 assert.deepEqual(validateLearningSequences(),[]);
 for(const i of stages){
  const fromCards=activitiesForStage(i);
  const stations=stationsForStage(i);
  assert.equal(stations.length,6);
  for(const [index,station] of stations.entries()){
   assert.equal(station.index,index);
   assert.equal(station.activity,fromCards[index]);
   assert.equal(stationIndex(i,station.activity.id),index);
   assert.equal(learningStation(i,station.activity.id)?.activity.label,station.activity.label);
   assert.equal(learningStation(i,station.activity.id)?.activity.icon,station.activity.icon);
   const steps=learningSequence(station.activity.id);
   assert.equal(steps.length,STEP_COUNT);
   assert.ok(steps.every(step=>step.activityId===station.activity.id));
  }
 }
});

test('cada botón tiene cuatro descubrimientos contextuales exclusivos desde Primaria a Emérito',()=>{
 assert.equal(Object.keys(ACTIVITY_MOMENTS).length,13*6);
 for(const i of stages.slice(1)){
  const all=stationsForStage(i);
  for(const station of all){
   const steps=learningSequence(station.activity.id);
   assert.ok(steps.slice(1).every(step=>step.question.includes(station.activity.label)));
   for(const other of all){
    if(other.activity.id===station.activity.id)continue;
    for(let pos=1;pos<5;pos++){
     assert.notEqual(steps[pos].question,learningSequence(other.activity.id)[pos].question);
    }
   }
  }
 }
});

test('pulsar una estación de otra etapa no abre ninguna aventura',()=>{
 for(const stageIndex of stages){
  for(const activity of ACTIVITIES){
   const expected=activity.minStage===stageIndex;
   assert.equal(!!learningStation(stageIndex,activity.id),expected,`${activity.id} en etapa ${stageIndex}`);
  }
 }
 assert.equal(learningStation(0,'etapa0-inexistente'),null);
});

test('cambiar de estación no traslada las respuestas entre aventuras',()=>{
 const state=newGame('Curiosín','biologia');
 const blocks=learningSequence('etapa0-bloques');
 const seeds=learningSequence('etapa0-semillas');
 const after=applyGameAction(state,'learning.answer',{
  activityId:'etapa0-bloques',stepIndex:0,answer:blocks[0].correct
 }).next;
 assert.equal(masteredSteps(after.learningProgress,'etapa0-bloques'),1);
 assert.equal(masteredSteps(after.learningProgress,'etapa0-semillas'),0);
 const next=applyGameAction(after,'learning.answer',{
  activityId:'etapa0-semillas',stepIndex:0,answer:seeds[0].correct
 }).next;
 assert.equal(masteredSteps(next.learningProgress,'etapa0-semillas'),1);
 assert.equal(masteredSteps(next.learningProgress,'etapa0-bloques'),1);
});

test('la selección es puramente lectura: conserva el estado y los recursos de juego',()=>{
 const state=newGame('Curiosín','biologia');
 const before=structuredClone(state);
 const selected=learningStation(0,'etapa0-bloques');
 assert.ok(selected?.activity.label==='Construir con bloques');
 assert.ok(learningSequence(selected.activity.id).length===5);
 assert.deepEqual(state,before);
});

test('420 preguntas de estaciones son inequívocas en sus textos tras corrección',()=>{
 const all=ACTIVITIES.flatMap(activity=>learningSequence(activity.id));
 assert.equal(all.length,420);
 assert.equal(new Set(all.map(step=>step.question)).size,420);
});
