/** Pruebas del motor puro: no hay UI ni recursos externos. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, applyGameAction, STAGE_GATE } from '../dist/src/core/engine-game.js';
import { STAGES, ACTIVITIES, activitiesForStage } from '../dist/src/data/catalog.js';
import { PET_KINDS,petArea,petSprite,spriteFrame } from '../dist/src/data/pet-visuals.js';
import { readFileSync } from 'node:fs';
const run=(state,action,payload={},now=Date.now())=>applyGameAction(state,action,payload,now).next;
test('nueva partida conserva contratos y estadísticas iniciales',()=>{
 const s=newGame('Curiosín','agro');
 assert.equal(s.schemaVersion,2);assert.equal(s.stageIndex,0);assert.equal(s.pet.stageId,STAGES[0].id);
 assert.equal(s.ap,20);assert.equal(s.generation,1);
});
test('actividad productiva gasta PA; no modifica el snapshot original',()=>{
 const s=newGame('A');const next=run(s,'activity.execute',{activityId:'etapa0-colores'});
 assert.equal(s.actions,0);assert.equal(next.actions,1);assert.equal(next.ap,18);assert.ok(next.totalXp>0);
});
test('no se puede hacer actividad bloqueada ni con PA insuficientes',()=>{
 const s=newGame('A');assert.throws(()=>run(s,'activity.execute',{activityId:'articulo'}));
 s.ap=0;assert.throws(()=>run(s,'activity.execute',{activityId:'etapa0-colores'}));
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
test('apoyos ficticios de convivencia permiten ganar créditos en Kínder sin empleo infantil',()=>{
 const s=newGame('A');s.credits=0;
 const next=run(s,'activity.execute',{activityId:'etapa0-compartir'});
 assert.equal(next.credits,4);assert.ok(next.totalXp>0);assert.ok(next.ap<s.ap);
});
test('sin acciones imposibles a coste negativo y necesidades siempre dentro de rango',()=>{
 const s=newGame('A');s.pet.needs.energy=100;s.pet.needs.stress=0;
 const next=run(s,'care.perform',{careActionId:'dormir'});
 assert.equal(next.pet.needs.energy,100);assert.equal(next.pet.needs.stress,0);
});

test('las 14 etapas disponen de seis actividades adecuadas y exclusivas',()=>{
 assert.equal(STAGES.length,14);assert.equal(ACTIVITIES.length,84);
 for(let i=0;i<14;i++){
  const actions=activitiesForStage(i);assert.equal(actions.length,6);
  assert.ok(actions.every(a=>a.minStage===i&&a.maxStage===i));
  assert.equal(new Set(actions.map(a=>a.id)).size,6);
 }
 assert.equal(activitiesForStage(0).some(a=>/tutoría|artículo|manuscrito/i.test(a.label)),false);
 assert.equal(activitiesForStage(7).some(a=>/tesis|modelo|experimento/i.test(a.label)),true);
});
test('una actividad de etapa anterior queda bloqueada y no se reutiliza',()=>{
 const s=newGame('A');s.stageIndex=7;s.ap=STAGES[7].maxAP;
 assert.throws(()=>run(s,'activity.execute',{activityId:'etapa0-colores'}),/no disponible/);
 const a=activitiesForStage(7)[0];const next=run(s,'activity.execute',{activityId:a.id});
 assert.equal(next.actions,1);
});
test('progresar modifica el proyecto educativo, pero conserva la especie por área',()=>{
 const s=newGame('A','fisico');s.stageXp=STAGES[0].target;s.evidence=STAGE_GATE(0);
 const next=run(s,'career.confirmTransition');
 assert.equal(next.areaId,'fisico');assert.equal(next.pet.appearanceId,'fisico');
 assert.match(next.projectName,/primaria/i);
});
test('las siete especies tienen catorce cuadros de SVG disponibles',()=>{
 const areas=Object.keys(PET_KINDS);
 assert.equal(areas.length,7);
 for(const area of areas){
  assert.equal(petArea(area),area);
  const svg=readFileSync('dist'+petSprite(area).substring(1),'utf8');
  assert.ok(svg.startsWith('<svg'));
  assert.match(svg,/width="448" height="32"/);
  assert.ok(svg.length>500);
 }
 assert.equal(petArea('inexistente'),'biologia');assert.equal(spriteFrame(99),13);
});
test('el avance temporal conserva fracciones de puntos entre comprobaciones',()=>{
 const now=Date.now();const s=newGame('A');s.ap=0;s.lastProcessedSimTime=new Date(now).toISOString();
 let a=run(s,'time.processOffline',{lastProcessedMarker:s.lastProcessedSimTime},now+5*60_000);
 assert.equal(a.ap,0);assert.ok(a.apRegenRemainder>0);
 const b=run(a,'time.processOffline',{lastProcessedMarker:a.lastProcessedSimTime},now+15*60_000);
 assert.equal(b.ap,1);assert.ok((b.apRegenRemainder??0)<.001);
});
test('los eventos infantiles no presentan congresos ni revisores',()=>{
 const s=newGame('A');s.actions=6;
 const next=run(s,'activity.execute',{activityId:'etapa0-colores'});
 assert.equal(next.event?.title,'Materiales compartidos');
});

test('cambiar especie visual no cambia la trayectoria ni los recursos de una partida existente',()=>{
 const s=newGame('A','biologia');s.stageIndex=8;s.totalXp=1200;s.projectProgress=67;
 const updated=run(s,'pet.changeArea',{areaId:'agro'});
 assert.equal(updated.areaId,'agro');assert.equal(updated.pet.appearanceId,'agro');
 assert.equal(updated.stageIndex,8);assert.equal(updated.projectProgress,67);assert.equal(updated.totalXp,1200);
 assert.equal(s.areaId,'biologia');
 assert.throws(()=>run(updated,'pet.changeArea',{areaId:'inventada'}));
});
