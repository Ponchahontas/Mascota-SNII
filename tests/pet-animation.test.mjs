/**
 * Verifica estados visuales y efectos transitorios SIN abrir un navegador.
 * Las funciones probadas son puras y deben permanecer libres de mutaciones.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { moodForNeeds, reactionForCommand, REACTION_LOOK } from '../dist/src/ui/pet-animation.js';
import { newGame } from '../dist/src/core/engine-game.js';
import { petSprite, spriteFrame, PET_KINDS } from '../dist/src/data/pet-visuals.js';

const healthy = () => ({...newGame('Prueba').pet.needs,energy:85,motivation:80,concentration:82,wellbeing:90,stress:12});
const critical = (key,value) => ({...healthy(),[key]:value});

test('cada necesidad vital adversa produce un gesto y texto apropiados',()=>{
 const expected=[
  ['energy',0,'agotado'],['energy',30,'cansado'],
  ['motivation',0,'desanimado'],['concentration',0,'distraido'],
  ['wellbeing',0,'abatido'],['stress',100,'saturado'],['stress',80,'tenso'],
 ];
 for (const [key,value,mood] of expected) {
  const result=moodForNeeds(critical(key,value));
  assert.equal(result.mood,mood,`${key}:${value}`);
  assert.ok(result.label && result.hint && result.symbol);
  assert.equal(result.signals[0].key,key);
 }
});

test('la mascota estable se muestra feliz y la intermedia atenta',()=>{
 assert.equal(moodForNeeds(healthy()).mood,'feliz');
 const medium={...healthy(),energy:55,wellbeing:50};
 assert.equal(moodForNeeds(medium).mood,'atento');
});

test('las crisis combinadas conservan todas sus señales y priorizan gravedad',()=>{
 const needs={...healthy(),energy:25,motivation:10,stress:97,concentration:20};
 const visual=moodForNeeds(needs);
 assert.equal(visual.mood,'desanimado','La primera señal crítica del orden estable tiene prioridad.');
 assert.deepEqual(visual.signals.map(s=>s.key),['motivation','stress','energy','concentration']);
 assert.equal(visual.signals.filter(s=>s.severe).length,2);
});

test('la lectura visual jamás modifica necesidades ni otros datos de la partida',()=>{
 const needs=critical('stress',99),frozen=structuredClone(needs);
 Object.freeze(needs);
 moodForNeeds(needs);
 assert.deepEqual(needs,frozen);
 const before=newGame('Sin efectos');
 const after=structuredClone(before);after.pet.needs.energy+=7;
 reactionForCommand('care.perform',before,after);
 assert.equal(before.pet.needs.energy+7,after.pet.needs.energy);
});

test('las reacciones solo se generan para acciones que realmente lo ameritan',()=>{
 const before=newGame('Reacción');
 const after=structuredClone(before);after.stageIndex=1;
 assert.equal(reactionForCommand('career.confirmTransition',before,after),'evolucion');
 assert.equal(reactionForCommand('career.confirmTransition',before,before),null);
 assert.equal(reactionForCommand('care.perform',before,before),'alivio');
 assert.equal(reactionForCommand('activity.execute',before,before),'aprendizaje');
 assert.equal(reactionForCommand('project.submit',before,before),'celebracion');
 assert.equal(reactionForCommand('time.processOffline',before,before),null);
 for(const pulse of ['alivio','aprendizaje','celebracion','evolucion']) {
  assert.ok(REACTION_LOOK[pulse].symbol && REACTION_LOOK[pulse].description);
 }
});

test('las nueve especies conservan imágenes diferentes y sus 14 cuadros por etapa',()=>{
 const areas=Object.keys(PET_KINDS);
 assert.equal(areas.length,9);
 assert.equal(new Set(areas.map(petSprite)).size,9);
 assert.equal(spriteFrame(-99),0);
 assert.equal(spriteFrame(99),13);
 assert.deepEqual(Array.from({length:14},(_,i)=>spriteFrame(i)),Array.from({length:14},(_,i)=>i));
});
