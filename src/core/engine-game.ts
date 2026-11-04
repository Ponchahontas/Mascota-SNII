/** Motor puro: ninguna función accede al DOM ni al almacenamiento. */
import { ACTIVITIES, CARE, EVENTS, SCHOOL_EVENTS, STAGES, STAGE_GUIDES, AREAS } from '../data/catalog.js';
import type { GameSave, NeedsState } from './state.js';
import { applyNeedChanges } from './engine-needs.js';
export interface EngineOutcome { next:GameSave; changes:string[]; events:string[]; warnings:string[] }
export type ActionType = 'activity.execute'|'care.perform'|'career.confirmTransition'|'project.submit'|'event.resolve'|'automation.activate'|'automation.deactivate'|'time.processOffline'|'legacy.startGeneration'|'pet.rename'|'pet.changeArea';
export const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export const STAGE_GATE=(index:number)=>Math.min(4,1+Math.floor(index/3));
function fail(msg:string):never { throw new Error(msg); }
const copy=(save:GameSave):GameSave=>structuredClone(save);
const log=(next:GameSave,message:string)=>{next.history=[message,...next.history].slice(0,28)};
const id=()=>typeof crypto !== 'undefined'&&'randomUUID' in crypto?crypto.randomUUID():`game-${Date.now()}-${Math.random().toString(36).slice(2)}`;
export function newGame(name:string,areaId:string='biologia',difficultyId:string='normal',generation=1):GameSave {
 const stage=STAGES[0]; const now=new Date().toISOString();
 return {gameId:id(),schemaVersion:2,contentVersion:'2026.11-areas-stages',balanceVersion:'0.3-provisional',normativeVersionId:'unverified',revision:0,createdAt:now,lastProcessedSimTime:now,
 pet:{id:id(),name:name.trim().slice(0,28)||'Investigador',stageId:stage.id,appearanceId:areaId,
 needs:{energy:85,motivation:78,concentration:76,wellbeing:80,stress:12,curiosity:86,competence:58,socialization:70,scientificIntegrity:100}},
 areaId,difficultyId,stageIndex:0,generation,ap:stage.maxAP,credits:65,stageXp:0,totalXp:0,evidence:0,completedProjects:0,
 projectProgress:0,projectName:STAGE_GUIDES[0].project,actions:0,lastActivity:'',streak:0,automation:false,event:null,eventCursor:0,
 achievements:[],history:['La aventura científica acaba de comenzar.'],records:[],careTimes:{}};
}
function addXp(s:GameSave,pe:number){const value=Math.max(0,Math.round(pe));s.stageXp+=value;s.totalXp+=value; return value}
function checkAchievements(s:GameSave){
 const targets:[string,boolean,string][]=[['primer-paso',s.actions>=1,'¡Primer paso académico!'],['constancia',s.actions>=20,'Ritmo académico: 20 acciones'],['proyecto',s.completedProjects>=1,'Primer proyecto completado'],['trayectoria',s.stageIndex>=4,'¡Ingresaste a la universidad!'],['snii',s.stageIndex>=9,'Llegaste a la etapa Candidato SNII'],['eterna',s.stageIndex>=13,'¡Carrera emérita!']];
 for(const [key,condition,label] of targets) if(condition&&!s.achievements.includes(key)){s.achievements.push(key);log(s,`🏅 ${label}`)}
}
function advanceProject(s:GameSave,delta:number){
 s.projectProgress=clamp(s.projectProgress+delta,0,100);
}
/** Resuelve un comando validado y retorna un nuevo snapshot para su commit atómico. */
export function applyGameAction(save:GameSave,type:ActionType,payload:Record<string,unknown>,now=Date.now()):EngineOutcome {
 const s=copy(save),changes:string[]=[], events:string[]=[], warnings:string[]=[];
 const stage=STAGES[s.stageIndex];
 switch(type){
 case 'activity.execute': {
  const a=ACTIVITIES.find(item=>item.id===payload.activityId);
  if(!a||s.stageIndex<a.minStage||s.stageIndex>a.maxStage)fail('Actividad no disponible en esta etapa educativa.');
  if(s.event)fail('Primero resuelve el evento pendiente.');
  const cost=Math.max(1,Math.ceil(a.pa*stage.cost));
  if(s.ap<cost)fail('Faltan puntos de acción. Se recuperan con el tiempo.');
  if(s.credits+a.credits<0)fail('No alcanzan los créditos ficticios. Busca una actividad de apoyo o entrega un proyecto de tu etapa.');
  if(s.pet.needs.energy<6)fail('Tu mascota necesita descansar antes de continuar.');
  s.ap-=cost;s.credits+=a.credits;
  const n=s.pet.needs;
  const condition=clamp((n.energy+n.motivation+n.concentration+(100-n.stress))/400,.45,1.15);
  const repeat=s.lastActivity===a.id?clamp(1-.09*s.streak,.55,1):1;
  const combo=s.lastActivity!==a.id && s.lastActivity!==''?1.12:1;
  const gained=addXp(s,a.pe*stage.reward*condition*repeat*combo);
  // La actividad se realiza por la mascota; en etapas infantiles está acompañada por docentes o cuidadores.
  s.pet.needs=applyNeedChanges(n,{energy:a.energy,stress:a.stress,concentration:a.focus,motivation:a.motivation??0,competence:1,curiosity:a.type==='investigacion'?2:1});
  s.actions++; s.streak=s.lastActivity===a.id?s.streak+1:0;s.lastActivity=a.id;
  advanceProject(s,Math.max(3,Math.round(gained/2)+3));
  if(s.actions%5===0){s.evidence++;events.push('Evidencia lúdica agregada al expediente');}
  if(s.actions%7===0&&!s.event){const pool=s.stageIndex<4?SCHOOL_EVENTS:EVENTS;const chosen=pool[s.eventCursor%pool.length];s.event={...chosen,options:chosen.options.map(o=>({...o}))};s.eventCursor++;events.push('Apareció un evento académico');}
  log(s,`${a.icon} ${a.label}: +${gained} UPE, ${a.credits>=0?'+':''}${a.credits} CR`);
  changes.push(`-${cost} PA`, `+${gained} UPE`);break;
 }
 case 'care.perform': {
  const c=CARE.find(item=>item.id===payload.careActionId); if(!c)fail('Cuidado desconocido.');
  if(s.credits+c.credits<0)fail('No hay créditos suficientes. Descansar y dormir son gratuitos.');
  // El enfriamiento limita la explotación de cuidado gratuito sin penalizar falta de PA.
  const cooldown=c.id==='dormir'?45_000:15_000;
  if(now-(s.careTimes[c.id]||0)<cooldown)fail('Esta actividad de cuidado necesita un breve descanso.');
  s.careTimes[c.id]=now;s.credits+=c.credits;
  const effects:Partial<Record<keyof NeedsState,number>>={};
  for(const field of ['energy','stress','wellbeing','motivation','concentration','socialization'] as const){const v=c[field];if(typeof v==='number')effects[field]=v;}
  s.pet.needs=applyNeedChanges(s.pet.needs,effects);
  log(s,`${c.icon} ${c.label}: mascota cuidada`);changes.push('Bienestar actualizado');break;
 }
 case 'project.submit': {
  if(s.projectProgress<100)fail('El proyecto necesita llegar al 100 %.');
  s.projectProgress=0;s.completedProjects++;s.evidence+=2;s.credits+=12;
  const earned=addXp(s,Math.round(12*stage.reward));
  log(s,`📁 Proyecto finalizado: +2 evidencias, +12 CR, +${earned} UPE`);changes.push('Proyecto entregado');break;
 }
 case 'career.confirmTransition': {
  if(s.stageIndex>=STAGES.length-1)fail('Ya alcanzaste la etapa Emérito. Puedes continuar jugando o iniciar un legado.');
  if(s.stageXp<stage.target)fail(`Necesitas ${stage.target} UPE para avanzar.`);
  if(s.evidence<STAGE_GATE(s.stageIndex))fail(`Necesitas ${STAGE_GATE(s.stageIndex)} evidencias lúdicas para avanzar.`);
  if(s.pet.needs.competence<50)fail('Mejora la competencia con más actividades antes de avanzar.');
  const old=stage.label;s.stageXp-=stage.target;s.evidence-=STAGE_GATE(s.stageIndex);s.stageIndex++;
  const nextStage=STAGES[s.stageIndex];s.pet.stageId=nextStage.id;s.projectName=STAGE_GUIDES[s.stageIndex].project;s.projectProgress=0;s.ap=clamp(s.ap+Math.round(nextStage.maxAP*.5),0,nextStage.maxAP);s.apRegenRemainder=0;s.credits+=20;
  log(s,`🎓 ${old} → ${nextStage.label}. Bono de 20 CR`);changes.push('Etapa avanzada');events.push('Nueva etapa desbloqueada');break;
 }
 case 'event.resolve': {
  if(!s.event)fail('No hay evento pendiente.');
  const option=s.event.options.find(o=>o.id===payload.optionId);if(!option)fail('Respuesta de evento inválida.');
  if(s.credits+option.credits<0)fail('No hay créditos para esta decisión.');
  const eventTitle=s.event.title;s.credits+=option.credits;s.pet.needs=applyNeedChanges(s.pet.needs,{stress:option.stress});
  const earned=addXp(s,Math.round(option.pe*stage.reward));s.event=null;
  log(s,`🎲 ${eventTitle}: +${earned} UPE`);changes.push('Evento resuelto');break;
 }
 case 'automation.activate': {
  if(s.stageIndex<4)fail('La automatización se desbloquea en Universidad.');
  if(s.automation)fail('Ya tienes un asistente activo.');
  if(s.credits<35)fail('El asistente cuesta 35 CR.');
  s.credits-=35;s.automation=true;log(s,'🤖 Asistente bibliográfico activado (-35 CR).');changes.push('Automatización activa');break;
 }
 case 'automation.deactivate': {
  if(!s.automation)fail('No hay automatización que desactivar.');
  s.automation=false;log(s,'🤖 Asistente bibliográfico desactivado.');changes.push('Automatización desactivada');break;
 }
 case 'time.processOffline': {
  const marker=typeof payload.lastProcessedMarker==='string'?payload.lastProcessedMarker:'';
  if(marker!==s.lastProcessedSimTime)fail('El intervalo ya se procesó o la partida cambió.');
  const then=Date.parse(marker),elapsed=now-then;
  if(!Number.isFinite(then)||elapsed<0){warnings.push('Reloj inconsistente: no se aplicó tiempo negativo.');break;}
  // Máximo ocho horas por ausencia; este comando es idempotente por ID y marcador temporal.
  const hours=Math.min(elapsed/3_600_000,8);
  // Conservamos la fracción de PA para que cada minuto cuente, incluso con la app abierta.
  const pooled=hours*stage.apPerHour+(s.apRegenRemainder??0);
  const regen=Math.floor(pooled);
  s.ap=clamp(s.ap+regen,0,stage.maxAP);
  s.apRegenRemainder=s.ap>=stage.maxAP?0:pooled-regen;
  const eased=Math.round(hours*2);s.pet.needs=applyNeedChanges(s.pet.needs,{energy:eased,stress:-eased,concentration:Math.round(hours)});
  if(s.automation&&hours>0){
    const maintenance=Math.min(s.credits,Math.ceil(hours));s.credits-=maintenance;
    // Producción de apoyo pequeña, nunca crea evidencia ni diplomas automáticamente.
    const passive=addXp(s,Math.floor(hours*(s.stageIndex>=9?5:3)));
    advanceProject(s,Math.floor(hours*2));changes.push(`+${passive} UPE de apoyo, -${maintenance} CR`);
  }
  s.lastProcessedSimTime=new Date(now).toISOString();
  if(hours>=.05)log(s,`🕰️ Ausencia simulada ${hours.toFixed(1)} h (máx. 8 h): +${regen} PA`);
  changes.push(`+${regen} PA por tiempo`);break;
 }
 case 'pet.changeArea': {
  const nextArea=typeof payload.areaId==='string'?payload.areaId:'';
  if(!AREAS.some(([key])=>key===nextArea))fail('Esa área no está disponible.');
  if(s.areaId===nextArea)fail('La mascota ya pertenece a esa área.');
  // Cambio exclusivamente cosmético: respeta PA, UPE, etapa, progreso y estadísticas.
  // Se habilita para adaptar partidas anteriores al selector de siete especies.
  s.areaId=nextArea;s.pet.appearanceId=nextArea;
  log(s,`🎭 La mascota adoptó la apariencia de ${AREAS.find(([key])=>key===nextArea)?.[1]}`);
  changes.push('Especie y área visual actualizadas; progreso intacto');break;
 }
 case 'pet.rename': {
  const name=typeof payload.petName==='string'?payload.petName.trim():'';
  if(name.length<1||name.length>28)fail('El nombre debe tener entre 1 y 28 caracteres.');
  s.pet.name=name;changes.push('Nombre actualizado');break;
 }
 case 'legacy.startGeneration': {
  if(s.stageIndex<9)fail('El modo legado se desbloquea desde Candidato SNII.');
  const name=typeof payload.newPetName==='string'?payload.newPetName.trim():'';
  if(!name||name.length>28)fail('Escribe un nombre válido para la siguiente generación.');
  const record={generation:s.generation,score:s.totalXp,maxStage:s.stageIndex,name:s.pet.name};
  const fresh=newGame(name,s.areaId,s.difficultyId,s.generation+1);
  // El legado conserva récords y un bono moderado; es voluntario y nunca borra historial previo.
  fresh.gameId=s.gameId;fresh.records=[...s.records,record].slice(-40);fresh.credits+=Math.min(40,Math.floor(s.totalXp/100));
  fresh.history=[`🌱 Legado de ${s.pet.name}: comienza la generación ${fresh.generation}.`,...fresh.history];
  Object.assign(s,fresh);changes.push('Nueva generación iniciada');break;
 }
 default:fail('Comando desconocido.');
 }
 checkAchievements(s);
 return {next:s,changes,events,warnings};
}
