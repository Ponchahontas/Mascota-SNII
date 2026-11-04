/**
 * Pruebas de regresión para mecánicas sensibles al abandono de la partida.
 * Todos los relojes se inyectan, sin esperas ni temporizadores reales.
 */
import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, applyGameAction } from '../dist/src/core/engine-game.js';
import { criticalCount, difficultyOf, emptyRisk, performanceFactor, passiveNeedChange, studyBlocker, advanceAcademicRisk } from '../dist/src/core/engine-health.js';
import { validateSave, exportSave, parseImport } from '../dist/src/core/persistence.js';
const run=(s,type,payload={},now=Date.now())=>applyGameAction(s,type,payload,now).next;
const t=Date.parse('2026-11-04T08:00:00.000Z');
const duration=(s,hours)=>{
 const marker=s.lastProcessedSimTime;
 return run(s,'time.processOffline',{lastProcessedMarker:marker},Date.parse(marker)+hours*3600_000);
};

test('los tres modos están documentados y solo Tranquilo desactiva desenlace definitivo',()=>{
 assert.equal(difficultyOf('tranquilo').dropoutHours,null);
 assert.equal(difficultyOf('normal').dropoutHours,18);
 assert.equal(difficultyOf('exigente').dropoutHours,12);
 assert.equal(difficultyOf('desconocido').id,'normal');
});
test('el tiempo reduce energía, motivación, concentración, bienestar y aumenta estrés',()=>{
 const s=newGame('Tiempo');s.ap=0;s.lastProcessedSimTime=new Date(t).toISOString();
 const after=duration(s,2);
 for(const f of ['energy','motivation','concentration','wellbeing'])assert.ok(after.pet.needs[f]<s.pet.needs[f],f);
 assert.ok(after.pet.needs.stress>s.pet.needs.stress);
 assert.ok(after.ap>0,'La recuperación de PA no debe perderse.');
 assert.equal(s.pet.needs.energy,85,'La función no debe mutar original.');
});
test('una ausencia de varios días no calcula más de ocho horas de presión',()=>{
 const s=newGame('Tiempo');s.lastProcessedSimTime=new Date(t).toISOString();
 const eight=duration(s,8),severalDays=duration(s,200);
 assert.equal(severalDays.pet.needs.energy,eight.pet.needs.energy);
 assert.equal(severalDays.pet.needs.stress,eight.pet.needs.stress);
});
test('cada medidor extremo bloquea temporalmente trabajo académico, no cuidados',()=>{
 const initial=newGame('Bajo');
 for(const [key,value] of [['energy',0],['motivation',0],['concentration',0],['wellbeing',0],['stress',100]]){
  const s=structuredClone(initial);s.pet.needs[key]=value;
  assert.ok(studyBlocker(s.pet.needs),`${key} debe generar consecuencia`);
  assert.throws(()=>run(s,'activity.execute',{activityId:'etapa0-colores'}));
  const rest=run(s,'care.perform',{careActionId:'descansar'},t);
  assert.equal(rest.actions,s.actions,'Los cuidados siguen disponibles.');
 }
});
test('medidores debilitados reducen el rendimiento por actividad',()=>{
 const high=newGame('A');high.pet.needs.energy=100;high.pet.needs.motivation=100;high.pet.needs.concentration=100;high.pet.needs.wellbeing=100;high.pet.needs.stress=0;
 const low=structuredClone(high);low.pet.needs.energy=26;low.pet.needs.motivation=26;low.pet.needs.concentration=26;low.pet.needs.wellbeing=26;low.pet.needs.stress=75;
 const a=run(high,'activity.execute',{activityId:'etapa0-colores'});
 const b=run(low,'activity.execute',{activityId:'etapa0-colores'});
 assert.ok(a.stageXp>b.stageXp,'La mascota debilitada debe aprender más lentamente.');
 assert.ok(performanceFactor(low.pet.needs)<1);
});
test('un indicador crítico aislado no aumenta el riesgo de deserción',()=>{
 const s=newGame('Uno');s.pet.needs.energy=0;s.pet.needs.motivation=100;s.pet.needs.concentration=100;s.pet.needs.wellbeing=100;s.pet.needs.stress=0;
 assert.equal(criticalCount(s.pet.needs),1);
 const result=advanceAcademicRisk(s,8,new Date(t).toISOString());
 assert.equal(result.risk.criticalHours,0);assert.equal(result.risk.dropoutAt,null);
});
test('dos indicadores críticos activan alertas escalonadas, no una derrota instantánea',()=>{
 const s=newGame('Dos');s.pet.needs.energy=0;s.pet.needs.motivation=0;
 const a=advanceAcademicRisk(s,4,new Date(t).toISOString());
 assert.equal(a.risk.criticalHours,4);assert.equal(a.risk.alerts,1);assert.equal(a.risk.dropoutAt,null);
 const b=advanceAcademicRisk({...s,risk:a.risk},5,new Date(t).toISOString());
 assert.equal(b.risk.criticalHours,9);assert.equal(b.risk.alerts,2);assert.equal(b.risk.dropoutAt,null);
});
test('el cuidado puede romper una crisis y disminuir el riesgo acumulado',()=>{
 const s=newGame('Cuidado');s.pet.needs.energy=0;s.pet.needs.motivation=0;s.risk={criticalHours:8,alerts:1,dropoutAt:null,reason:null};
 const after=run(s,'care.perform',{careActionId:'dormir'},t);
 assert.equal(criticalCount(after.pet.needs),1);
 assert.equal(after.risk.criticalHours,7);
 assert.equal(after.risk.dropoutAt,null);
});
test('Equilibrado termina generación solo tras crisis combinada prolongada',()=>{
 let s=newGame('Crisis','biologia','normal');s.lastProcessedSimTime=new Date(t).toISOString();
 s.pet.needs.energy=0;s.pet.needs.motivation=0;s.pet.needs.concentration=0;s.pet.needs.wellbeing=0;s.pet.needs.stress=100;
 s=duration(s,8);assert.equal(s.risk.dropoutAt,null);
 s=duration(s,8);assert.equal(s.risk.dropoutAt,null);
 s=duration(s,8);assert.ok(s.risk.dropoutAt);
 assert.throws(()=>run(s,'activity.execute',{activityId:'etapa0-colores'}));
 const restarted=run(s,'career.restartAfterDropout');
 assert.equal(restarted.generation,2);assert.equal(restarted.records[0].outcome,'desercion');
 assert.equal(restarted.pet.name,s.pet.name);assert.equal(restarted.stageIndex,0);
 assert.equal(restarted.risk.dropoutAt,null);
});
test('modo Tranquilo limita bloqueos sin forzar deserción',()=>{
 let s=newGame('Tranquilo','biologia','tranquilo');s.lastProcessedSimTime=new Date(t).toISOString();
 s.pet.needs.energy=0;s.pet.needs.motivation=0;
 for(let i=0;i<6;i++)s=duration(s,8);
 assert.equal(s.risk.dropoutAt,null);
 assert.ok(s.risk.criticalHours>=18);
});
test('Exigente llega antes al final, pero permite recuperación y conserva récords',()=>{
 let s=newGame('Exigente','biologia','exigente');s.lastProcessedSimTime=new Date(t).toISOString();
 s.pet.needs.energy=0;s.pet.needs.motivation=0;
 s=duration(s,8);assert.equal(s.risk.dropoutAt,null);
 s=duration(s,8);assert.ok(s.risk.dropoutAt);
 const after=run(s,'career.restartAfterDropout');assert.equal(after.records[0].generation,1);
});
test('guardar/importar legado v2 sin risk funciona y crea los campos con el primer comando',()=>{
 const s=newGame('Viejo');delete s.risk;
 assert.equal(validateSave(s),true);
 const loaded=parseImport(exportSave(s));assert.equal(loaded.risk,undefined);
 const fixed=run(loaded,'care.perform',{careActionId:'descansar'},t);
 assert.equal(fixed.risk.criticalHours,0);
});
test('una importación maliciosa con riesgos no numéricos se rechaza',()=>{
 const s=newGame('Ataque');s.risk.criticalHours=Number.NaN;
 assert.equal(validateSave(s),false);
 s.risk.criticalHours=0;s.risk.dropoutAt='<script>alert(1)</script>';
 assert.equal(validateSave(s),false);
});
test('tasa y penalización del desgaste varían de Kínder a SNII III',()=>{
 const n=newGame('A').pet.needs;
 const early=passiveNeedChange(n,1,0,'normal'),late=passiveNeedChange(n,1,12,'normal');
 assert.ok(late.energy<early.energy);
 assert.ok(late.stress>early.stress);
});

// Este caso era un bloqueo posible: sin créditos y con motivación/bienestar en cero,
// las actividades estaban prohibidas y los cuidados de ambos medidores costaban CR.
test('acompañamiento gratuito evita partidas bloqueadas con cero créditos',()=>{
 const s=newGame('Rescate');s.credits=0;s.pet.needs.motivation=0;s.pet.needs.wellbeing=0;
 assert.throws(()=>run(s,'activity.execute',{activityId:'etapa0-colores'}));
 let a=run(s,'care.perform',{careActionId:'acompanar'},t);
 assert.equal(a.credits,0);assert.equal(a.pet.needs.motivation,4);assert.equal(a.pet.needs.wellbeing,3);
 a=run(a,'care.perform',{careActionId:'acompanar'},t+16_000);
 assert.ok(a.pet.needs.motivation>5&&a.pet.needs.wellbeing>5);
 const next=run(a,'activity.execute',{activityId:'etapa0-compartir'});
 assert.ok(next.credits>0);
});
