/**
 * Regresión editorial: una actividad no debe copiar dos veces la introducción
 * de su área, ni reutilizar preguntas idénticas o una letra fija como solución.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {AREA_ROUTES,fieldChallenge} from '../dist/src/data/area-routes.js';
import {ACTIVITIES,STAGES} from '../dist/src/data/catalog.js';
import {learningSequence} from '../dist/src/data/learning-sequences.js';

test('126 escenas sin título ni introducción duplicados',()=>{
 const questions=new Set();
 for(const [areaId,area] of Object.entries(AREA_ROUTES))
  for(let stage=0;stage<STAGES.length;stage++){
   const q=fieldChallenge(areaId,stage);
   assert.ok(!q.scene.includes(area.introduction),areaId+':'+stage);
   assert.ok(!q.scene.includes(q.title),areaId+':'+stage);
   assert.ok(!questions.has(q.question),areaId+':'+stage);
   assert.ok(q.options[q.correct]);
   questions.add(q.question);
  }
 assert.equal(questions.size,126);
});

test('cada área presenta 14 escenas, pistas y preguntas distintas',()=>{
 for(const areaId of Object.keys(AREA_ROUTES)){
  const steps=Array.from({length:14},(_,i)=>fieldChallenge(areaId,i));
  for(const key of ['question','hint','scene','explanation'])
   assert.equal(new Set(steps.map(s=>s[key])).size,14,areaId+': '+key);
 }
});

test('las 78 aventuras avanzadas tienen 312 preguntas diferenciadas y respuestas variadas',()=>{
 const advanced=ACTIVITIES.filter(a=>a.minStage>0);
 assert.equal(advanced.length,78);
 const questions=new Set();
 for(const activity of advanced){
  const steps=learningSequence(activity.id).slice(1);
  assert.equal(steps.length,4);
  assert.ok(new Set(steps.map(step=>step.correct)).size>=3,activity.id);
  for(const step of steps){
   assert.ok(step.question.includes(activity.label),activity.id);
   assert.ok(!step.scene.includes(activity.label),activity.id);
   assert.ok(!questions.has(step.question),activity.id);
   assert.ok(!/\?[^\s]*\?/.test(step.question),activity.id);
   questions.add(step.question);
  }
 }
 assert.equal(questions.size,312);
});

test('Carrera separa escena de introducción y oculta la explicación opcional',()=>{
 const ui=readFileSync('src/ui/app.ts','utf8');
 assert.match(ui,/class="area-route-help"/);
 assert.match(ui,/class="field-setting"/);
 assert.doesNotMatch(ui,/La especialización se elige al llegar a Universidad\. Por ahora/);
});
