/** Pruebas del motor puro: no hay UI ni recursos externos. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, applyGameAction, STAGE_GATE } from '../dist/src/core/engine-game.js';
import { STAGES } from '../dist/src/data/catalog.js';
const run=(state,action,payload={},now=Date.now())=>applyGameAction(state,action,payload,now).next;
test('nueva partida conserva contratos y estadísticas iniciales',()=>{
 const s=newGame('Curiosín','agro');
 assert.equal(s.schemaVersion,2);assert.equal(s.stageIndex,0);assert.equal(s.pet.stageId,STAGES[0].id);
 assert.equal(s.ap,20);assert.equal(s.generation,1);
});
test('actividad productiva gasta PA; no modifica el snapshot original',()=>{
 const s=newGame('A');const next=run(s,'activity.execute',{activityId:'estudiar'});
 assert.equal(s.actions,0);assert.equal(next.actions,1);assert.equal(next.ap,17);assert.ok(next.totalXp>0);
});
test('no se puede hacer actividad bloqueada ni con PA insuficientes',()=>{
 const s=newGame('A');assert.throws(()=>run(s,'activity.execute',{activityId:'articulo'}));
 s.ap=0;assert.throws(()=>run(s,'activity.execute',{activityId:'estudiar'}));
});
test('descansar no gasta PA y respeta enfriamiento',()=>{
 const s=newGame('A');s.ap=0;s.pet.needs.energy=10;
 const now=Date.now();const a=run(s,'care.perform',{careActionId:'descansar'},now);
 assert.equal(a.ap,0);assert.equal(a.pet.needs.energy,18);
 assert.throws(()=>run(a,'care.perform',{careActionId:'descansar'},now+500));
});
test('ausencia limita regeneración a ocho horas y no permite repetir marcador',()=>{
 const s=newGame('A');s.ap=0;s.lastProcessedSimTime=new Date(Date.now()-96*3600000).toISOString();
 const res=run(s,'time.processOffline',{lastProcessedMarker:s.lastProcessedSimTime});
 assert.equal(res.ap,32>STAGES[0].maxAP?STAGES[0].maxAP:32);
 assert.notEqual(res.lastProcessedSimTime,s.lastProcessedSimTime);
 assert.throws(()=>run(res,'time.processOffline',{lastProcessedMarker:s.lastProcessedSimTime}));
});
test('no se avanza sin evidencias ni UPE; transición con requisitos',()=>{
 const s=newGame('A');assert.throws(()=>run(s,'career.confirmTransition'));
 s.stageXp=STAGES[0].target;s.evidence=STAGE_GATE(0);
 const next=run(s,'career.confirmTransition');assert.equal(next.stageIndex,1);assert.equal(next.pet.stageId,STAGES[1].id);
});
test('proyecto requiere 100 % y entrega recompensa una vez',()=>{
 const s=newGame('A');assert.throws(()=>run(s,'project.submit'));
 s.projectProgress=100;const next=run(s,'project.submit');assert.equal(next.projectProgress,0);assert.equal(next.evidence,2);
 assert.throws(()=>run(next,'project.submit'));
});
test('un evento no puede resolverse dos veces',()=>{
 const s=newGame('A');s.event={id:'demo',title:'Prueba',body:'Prueba',options:[{id:'si',label:'Sí',pe:5,credits:0,stress:0}]};
 const next=run(s,'event.resolve',{optionId:'si'});assert.equal(next.event,null);
 assert.throws(()=>run(next,'event.resolve',{optionId:'si'}));
});
test('automatización no disponible hasta universidad y nunca da evidencias offline',()=>{
 const s=newGame('A');assert.throws(()=>run(s,'automation.activate'));
 s.stageIndex=4;s.credits=100;const active=run(s,'automation.activate');
 const n=run({...active,lastProcessedSimTime:new Date(Date.now()-3600000).toISOString()},'time.processOffline',{lastProcessedMarker:new Date(Date.now()-3600000).toISOString()});
 assert.equal(n.evidence,0);assert.ok(n.totalXp>0);
});
test('legado preserva récord y cambia generación sin final obligatorio',()=>{
 const s=newGame('A');s.stageIndex=9;s.totalXp=1000;
 const next=run(s,'legacy.startGeneration',{newPetName:'B'});
 assert.equal(next.generation,2);assert.equal(next.records[0].score,1000);assert.equal(next.pet.name,'B');assert.equal(next.stageIndex,0);
});
test('tutorías tempranas permiten ganar créditos desde Kínder sin bloquear la partida',()=>{
 const s=newGame('A');s.credits=0;
 const next=run(s,'activity.execute',{activityId:'tutoria'});
 assert.equal(next.credits,4);assert.ok(next.totalXp>0);assert.ok(next.ap<s.ap);
});
test('sin acciones imposibles a coste negativo y necesidades siempre dentro de rango',()=>{
 const s=newGame('A');s.pet.needs.energy=100;s.pet.needs.stress=0;
 const next=run(s,'care.perform',{careActionId:'dormir'});
 assert.equal(next.pet.needs.energy,100);assert.equal(next.pet.needs.stress,0);
});
