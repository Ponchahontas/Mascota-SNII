/**
 * @module engine-game
 * Motor de dominio de Mascota-SNII.
 *
 * RESPONSABILIDAD: evaluar reglas y devolver un snapshot NUEVO de la partida.
 * No utiliza DOM, IndexedDB ni red. La UI no debe modificar recursos por su cuenta.
 *
 * INVARIANTES:
 * - Las actividades pertenecen exclusivamente a su etapa educativa.
 * - PA y necesidades se mantienen dentro de sus límites; no se otorgan PA negativos.
 * - Los créditos, evidencias y UPE son indicadores lúdicos, NO criterios oficiales SNII.
 * - El tiempo sin conexión se limita a 8 h por procesamiento.
 * - Un comando NO se vuelve idempotente aquí: la deduplicación vive en persistence.ts.
 *
 * Ruta de una acción: UI -> game-coordinator -> persistence -> applyGameAction.
 * Ver docs/11_GUIA_DE_CODIGO.md antes de modificar fórmulas o progresión.
 */
import { ACTIVITIES, CARE, EVENTS, SCHOOL_EVENTS, STAGES, STAGE_GUIDES, AREAS } from '../data/catalog.js';
import { learningSequence, masteredSteps, STEP_COUNT } from '../data/learning-sequences.js';
import { AREA_ROUTES, branchOf, fieldChallenge } from '../data/area-routes.js';
import type { GameSave, NeedsState } from './state.js';
import { applyNeedChanges } from './engine-needs.js';
import { difficultyOf, emptyRisk, passiveNeedChange, advanceAcademicRisk, easeRiskAfterCare, performanceFactor, studyBlocker, riskOf } from './engine-health.js';
/** Resultado sin persistir. `next` debe guardarse junto al registro del comando. */
export interface EngineOutcome { next:GameSave; changes:string[]; events:string[]; warnings:string[] }
/** Vocabulario de operaciones que el motor implementa realmente (no el catálogo futuro). */
export type ActionType = 'learning.answer'|'activity.execute'|'care.perform'|'career.confirmTransition'|'project.submit'|'event.resolve'|'automation.activate'|'automation.deactivate'|'time.processOffline'|'legacy.startGeneration'|'pet.rename'|'pet.changeArea'|'career.restartAfterDropout'|'career.chooseRoute'|'career.completeFieldMission';
/** Limita números; usar especialmente en recursos y progreso para evitar valores fuera de rango. */
export const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
/** Evidencias lúdicas mínimas para transición; fórmula provisional, NO del DOF. */
export const STAGE_GATE=(index:number)=>Math.min(4,1+Math.floor(index/3));
function fail(msg:string):never { throw new Error(msg); }
// Se trabaja sobre una copia profunda: un rechazo nunca debe mutar la partida recibida.
const copy=(save:GameSave):GameSave=>structuredClone(save);
const log=(next:GameSave,message:string)=>{next.history=[message,...next.history].slice(0,28)};
const id=()=>typeof crypto !== 'undefined'&&'randomUUID' in crypto?crypto.randomUUID():`game-${Date.now()}-${Math.random().toString(36).slice(2)}`;
/**
 * Crea una partida completamente nueva con recursos iniciales de Kínder.
 * @param name Nombre visible, limitado a 28 caracteres.
 * @param areaId Área temática y especie visual (se mantiene entre etapas).
 * @param difficultyId Tranquilo, normal o exigente; controla deterioro y desenlace.
 * @param generation Generación a registrar para el modo legado.
 * @returns Estado serializable con revisión cero, apto para initializeSave().
 */
export function newGame(name:string,areaId:string='biologia',difficultyId:string='normal',generation=1):GameSave {
 const stage=STAGES[0]; const now=new Date().toISOString();
 return {gameId:id(),schemaVersion:2,contentVersion:'2026.11-areas-stages',balanceVersion:'0.5-vitales-provisional',normativeVersionId:'unverified',revision:0,createdAt:now,lastProcessedSimTime:now,
 pet:{id:id(),name:name.trim().slice(0,28)||'Investigador',stageId:stage.id,appearanceId:areaId,
 needs:{energy:85,motivation:78,concentration:76,wellbeing:80,stress:12,curiosity:86,competence:58,socialization:70,scientificIntegrity:100}},
 areaId,areaPath:undefined,fieldMilestones:[],difficultyId:difficultyOf(difficultyId).id,stageIndex:0,generation,ap:stage.maxAP,risk:emptyRisk(),credits:65,stageXp:0,totalXp:0,evidence:0,completedProjects:0,
 projectProgress:0,projectName:STAGE_GUIDES[0].project,actions:0,lastActivity:'',streak:0,automation:false,event:null,eventCursor:0,
 achievements:[],history:['La aventura científica acaba de comenzar.'],records:[],careTimes:{},learningProgress:{},learningRewarded:[]};
}
/** Suma UPE de juego y actualiza el total histórico; NO concede evidencia por sí mismo. */
function addXp(s:GameSave,pe:number){const value=Math.max(0,Math.round(pe));s.stageXp+=value;s.totalXp+=value; return value}
/** Registra cada logro una sola vez; la interfaz solo lo visualiza. */
function checkAchievements(s:GameSave){
 const targets:[string,boolean,string][]=[['primer-paso',s.actions>=1,'¡Primer paso académico!'],['constancia',s.actions>=20,'Ritmo académico: 20 acciones'],['proyecto',s.completedProjects>=1,'Primer proyecto completado'],['trayectoria',s.stageIndex>=4,'¡Ingresaste a la universidad!'],['snii',s.stageIndex>=9,'Llegaste a la etapa Candidato SNII'],['eterna',s.stageIndex>=13,'¡Carrera emérita!']];
 for(const [key,condition,label] of targets) if(condition&&!s.achievements.includes(key)){s.achievements.push(key);log(s,`🏅 ${label}`)}
}
/** Progreso de proyecto entre 0 y 100; solo project.submit genera su entrega. */
function advanceProject(s:GameSave,delta:number){
 s.projectProgress=clamp(s.projectProgress+delta,0,100);
}
/**
 * Aplica una acción a un snapshot sin alterarlo y calcula sus consecuencias.
 *
 * @param save Estado actual que se considera de solo lectura.
 * @param type Nombre exacto de la operación.
 * @param payload Datos de la acción; cada rama verifica sus precondiciones.
 * @param now Marca de tiempo en milisegundos, inyectable para pruebas.
 * @returns Snapshot nuevo, cambios legibles, eventos de dominio y advertencias.
 * @throws Error ante falta de recursos, etapa incorrecta o comando no permitido.
 *
 * IMPORTANTE: No guardar desde este módulo ni asumir que una acción se confirmó.
 * Solo commitCommand() valida la revisión y persiste atómicamente el resultado.
 */
export function applyGameAction(save:GameSave,type:ActionType,payload:Record<string,unknown>,now=Date.now()):EngineOutcome {
 const s=copy(save),changes:string[]=[], events:string[]=[], warnings:string[]=[];
 const stage=STAGES[s.stageIndex];
 // Un final de deserción conserva el expediente, pero requiere reinicio para jugar.
 if(riskOf(s).dropoutAt&&type!=='career.restartAfterDropout')fail('La trayectoria está interrumpida. Inicia una nueva generación para continuar.');
 switch(type){
 // Las respuestas correctas se guardan sin PA ni UPE. Si el comando se reenvía,
 // la idempotencia del coordinador impide duplicar el acierto o la recompensa.
 case 'learning.answer': {
  const activityId=typeof payload.activityId==='string'?payload.activityId:'';
  const stepIndex=payload.stepIndex,answer=payload.answer;
  const a=ACTIVITIES.find(item=>item.id===activityId);
  if(!a||s.stageIndex<a.minStage||s.stageIndex>a.maxStage)fail('La aventura no corresponde a esta etapa.');
  if(!Number.isInteger(stepIndex)||typeof stepIndex!=='number'||stepIndex<0||stepIndex>=STEP_COUNT)fail('Paso de aprendizaje inválido.');
  if(!Number.isInteger(answer)||typeof answer!=='number'||answer<0||answer>2)fail('Opción de respuesta inválida.');
  const sequence=learningSequence(activityId);
  if(sequence[stepIndex]?.correct!==answer)fail('La respuesta no es correcta. Puedes volver a intentarlo sin costo.');
  s.learningProgress??={};
  const completed=s.learningProgress[activityId]??[];
  if(completed.includes(stepIndex)){changes.push('Respuesta ya registrada');break;}
  // La secuencia se completa en orden para que no se puedan saltar pasos.
  if(stepIndex!==completed.length)fail('Termina el paso anterior antes de continuar.');
  s.learningProgress[activityId]=[...completed,stepIndex];
  const mastered=masteredSteps(s.learningProgress,activityId)===STEP_COUNT;
  if(mastered)log(s,`🏅 Aventura dominada: ${a.label} (5/5). Repetición desbloqueada.`);
  changes.push(mastered?'¡5 de 5! Aventura dominada y repetición desbloqueada':`Respuesta ${stepIndex+1}/5 guardada`);
  break;
 }
 // Actividad pedagógica propia de la etapa: Kínder no imparte tutorías ni publica artículos.
 case 'activity.execute': {
  const a=ACTIVITIES.find(item=>item.id===payload.activityId);
  if(!a||s.stageIndex<a.minStage||s.stageIndex>a.maxStage)fail('Actividad no disponible en esta etapa educativa.');
  const practiceMode=payload.practiceMode;
  if(practiceMode!==undefined&&practiceMode!=='guided'&&practiceMode!=='repeat')fail('Modalidad de práctica desconocida.');
  // Las acciones heredadas sin practiceMode siguen funcionando para no romper
  // pruebas ni versiones antiguas del contrato. La UI nueva siempre envía modo.
  if(practiceMode&&masteredSteps(s.learningProgress,a.id)<STEP_COUNT)fail('Completa los cinco desafíos antes de practicar o repetir.');
  if(s.event)fail('Primero resuelve el evento pendiente.');
  const n=s.pet.needs;
  const blocked=studyBlocker(n);
  if(blocked)fail(blocked);
  // Bienestar bajo también hace que trabajar cueste más PA, aun sin bloquear.
  const cost=Math.max(1,Math.ceil(a.pa*stage.cost*(n.wellbeing<=25?1.2:1)));
  if(s.ap<cost)fail('Faltan puntos de acción. Se recuperan con el tiempo.');
  if(s.credits+a.credits<0)fail('No alcanzan los créditos ficticios. Busca una actividad de apoyo o entrega un proyecto de tu etapa.');
  s.ap-=cost;s.credits+=a.credits;
  // Rendimiento provisional según cuatro necesidades; penaliza fatiga/estrés.
  const condition=clamp((n.energy+n.motivation+n.concentration+(100-n.stress))/400,.45,1.15);
  // Rendimientos decrecientes al repetir una actividad; diversificar aporta un bono.
  const repeat=s.lastActivity===a.id?clamp(1-.09*s.streak,.55,1):1;
  const combo=s.lastActivity!==a.id && s.lastActivity!==''?1.12:1;
  // Penalizaciones causales acumulables por indicadores bajos y estrés elevado.
  // La UI usa la misma función para informar del impacto al jugador.
  // La primera práctica guiada concede un 25 % adicional UNA SOLA VEZ;
  // completar las preguntas sin hacer la práctica nunca regala recursos.
  s.learningRewarded??=[];
  const firstGuided=practiceMode==='guided'&&!s.learningRewarded.includes(a.id);
  const gained=addXp(s,a.pe*stage.reward*condition*performanceFactor(n)*repeat*combo*(firstGuided?1.25:1));
  if(firstGuided){s.learningRewarded.push(a.id);events.push('Primera práctica guiada: +25 % UPE base ajustadas');}
  // La actividad se realiza por la mascota; en etapas infantiles está acompañada por docentes o cuidadores.
  s.pet.needs=applyNeedChanges(n,{energy:a.energy,stress:a.stress,concentration:a.focus,motivation:a.motivation??0,competence:1,curiosity:a.type==='investigacion'?2:1});
  if(s.pet.needs.energy<=15||s.pet.needs.stress>=90)warnings.push('Tu mascota se encuentra en un estado crítico. Usa cuidados antes de continuar.');
  s.actions++; s.streak=s.lastActivity===a.id?s.streak+1:0;s.lastActivity=a.id;
  advanceProject(s,Math.max(3,Math.round(gained/2)+3));
  if(s.actions%5===0){s.evidence++;events.push('Evidencia lúdica agregada al expediente');}
  if(s.actions%7===0&&!s.event){const pool=s.stageIndex<4?SCHOOL_EVENTS:EVENTS;const chosen=pool[s.eventCursor%pool.length];s.event={...chosen,options:chosen.options.map(o=>({...o}))};s.eventCursor++;events.push('Apareció un evento académico');}
  log(s,`${a.icon} ${a.label}: +${gained} UPE, ${a.credits>=0?'+':''}${a.credits} CR`);
  changes.push(`-${cost} PA`, `+${gained} UPE`);break;
 }
 // Cuidado hecho por la persona jugadora: no consume PA y tiene enfriamiento corto.
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
  s.risk=easeRiskAfterCare(s);
  log(s,`${c.icon} ${c.label}: mascota cuidada`);changes.push('Bienestar actualizado');break;
 }
 // Solo una entrega completada concede evidencias y créditos; reinicia el avance.
 case 'project.submit': {
  if(s.projectProgress<100)fail('El proyecto necesita llegar al 100 %.');
  s.projectProgress=0;s.completedProjects++;s.evidence+=2;s.credits+=12;
  const earned=addXp(s,Math.round(12*stage.reward));
  log(s,`📁 Proyecto finalizado: +2 evidencias, +12 CR, +${earned} UPE`);changes.push('Proyecto entregado');break;
 }
 // Avance controlado por UPE, evidencias y competencia. Es ficción, no dictamen SNII.
 case 'career.confirmTransition': {
  if(s.stageIndex>=STAGES.length-1)fail('Ya alcanzaste la etapa Emérito. Puedes continuar jugando o iniciar un legado.');
  if(s.stageXp<stage.target)fail(`Necesitas ${stage.target} UPE para avanzar.`);
  if(s.evidence<STAGE_GATE(s.stageIndex))fail(`Necesitas ${STAGE_GATE(s.stageIndex)} evidencias lúdicas para avanzar.`);
  if(s.pet.needs.competence<50)fail('Mejora la competencia con más actividades antes de avanzar.');
  if(riskOf(s).criticalHours>=9)fail('Primero estabiliza a tu mascota antes de solicitar el avance de etapa.');
  const old=stage.label;s.stageXp-=stage.target;s.evidence-=STAGE_GATE(s.stageIndex);s.stageIndex++;
  const nextStage=STAGES[s.stageIndex];s.pet.stageId=nextStage.id;s.projectName=STAGE_GUIDES[s.stageIndex].project;s.projectProgress=0;s.ap=clamp(s.ap+Math.round(nextStage.maxAP*.5),0,nextStage.maxAP);s.apRegenRemainder=0;s.credits+=20;
  // Un logro relevante alivia ligeramente el desgaste, sin borrar crisis acumuladas.
  s.pet.needs=applyNeedChanges(s.pet.needs,{motivation:8,wellbeing:4,stress:-5});
  log(s,`🎓 ${old} → ${nextStage.label}. Bono de 20 CR`);changes.push('Etapa avanzada');events.push('Nueva etapa desbloqueada');break;
 }
 // Resolver el evento borra la elección pendiente; no se puede reclamar dos veces.
 case 'event.resolve': {
  if(!s.event)fail('No hay evento pendiente.');
  const option=s.event.options.find(o=>o.id===payload.optionId);if(!option)fail('Respuesta de evento inválida.');
  if(s.credits+option.credits<0)fail('No hay créditos para esta decisión.');
  const eventTitle=s.event.title;s.credits+=option.credits;s.pet.needs=applyNeedChanges(s.pet.needs,{stress:option.stress});
  const earned=addXp(s,Math.round(option.pe*stage.reward));s.event=null;
  log(s,`🎲 ${eventTitle}: +${earned} UPE`);changes.push('Evento resuelto');break;
 }
 // Automatización disponible solo desde universidad, con costo de instalación.
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
 // Marcador temporal + límite 8 h: evita bonificaciones por ausencias arbitrarias.
 case 'time.processOffline': {
  const marker=typeof payload.lastProcessedMarker==='string'?payload.lastProcessedMarker:'';
  if(marker!==s.lastProcessedSimTime)fail('El intervalo ya se procesó o la partida cambió.');
  const then=Date.parse(marker),elapsed=now-then;
  if(!Number.isFinite(then)||elapsed<0){warnings.push('Reloj inconsistente: no se aplicó tiempo negativo.');break;}
  // Máximo ocho horas por ausencia; este comando es idempotente por ID y marcador temporal.
  const hours=Math.min(elapsed/3_600_000,8);
  // Conservamos la fracción de PA para que cada minuto cuente, incluso con la app abierta.
  // Las fracciones se trasladan al siguiente ciclo; no truncarlas en cada minuto.
  // Si PA alcanzan el máximo, se descarta el excedente para impedir acumulación oculta.
  const pooled=hours*stage.apPerHour+(s.apRegenRemainder??0);
  const regen=Math.floor(pooled);
  s.ap=clamp(s.ap+regen,0,stage.maxAP);
  s.apRegenRemainder=s.ap>=stage.maxAP?0:pooled-regen;
  // Simulamos intervalos de hasta una hora: NO contamos como crítico un periodo
  // entero si los indicadores se volvieron críticos solo al final de la ausencia.
  // A diferencia de v0.4, el paso de tiempo deteriora suavemente las necesidades.
  let pending=hours;
  while(pending>1e-8&&!riskOf(s).dropoutAt){
    const step=Math.min(1,pending);
    s.pet.needs=passiveNeedChange(s.pet.needs,step,s.stageIndex,s.difficultyId);
    const outcome=advanceAcademicRisk(s,step,new Date(now).toISOString());
    s.risk=outcome.risk;
    for(const message of outcome.messages){warnings.push(message);log(s,message)}
    pending-=step;
  }
  if(s.automation&&hours>0&&!riskOf(s).dropoutAt){
    const maintenance=Math.min(s.credits,Math.ceil(hours));s.credits-=maintenance;
    // Producción de apoyo pequeña, nunca crea evidencia ni diplomas automáticamente.
    const passive=addXp(s,Math.floor(hours*(s.stageIndex>=9?5:3)));
    advanceProject(s,Math.floor(hours*2));changes.push(`+${passive} UPE de apoyo, -${maintenance} CR`);
  }
  s.lastProcessedSimTime=new Date(now).toISOString();
  if(hours>=.05&&!riskOf(s).dropoutAt)log(s,`🕰️ Tiempo simulado ${hours.toFixed(1)} h (máx. 8 h): +${regen} PA; las necesidades se desgastan gradualmente.`);
  changes.push(`+${regen} PA por tiempo`);break;
 }
 // Las dos ramas de cada área son decisiones de carrera ficticias, disponibles
 // desde Universidad. Se elige una por generación para dar rejugabilidad.
 case 'career.chooseRoute': {
  if(s.stageIndex<4)fail('Las especializaciones se eligen a partir de Universidad.');
  const id=typeof payload.branchId==='string'?payload.branchId:'';
  const branch=branchOf(s.areaId,id);
  if(!branch)fail('La especialización no pertenece al área elegida.');
  if(s.areaPath)fail('La especialización ya fue elegida en esta generación.');
  s.areaPath=id;
  log(s,`🧭 Ruta académica elegida: ${branch.label}.`);
  changes.push(`Nueva ruta: ${branch.label}`);break;
 }
 // Un único reto temático por etapa y generación; no usa PA, es opcional
 // y no reemplaza los cinco retos propios de cada actividad.
 case 'career.completeFieldMission': {
  const answer=payload.answer;
  const branch=s.stageIndex>=4?branchOf(s.areaId,s.areaPath):null;
  if(s.stageIndex>=4&&!branch)fail('Elige primero una especialización para comenzar el reto de campo.');
  const challenge=fieldChallenge(s.areaId,s.stageIndex,s.areaPath);
  if(typeof answer!=='number'||!Number.isInteger(answer)||answer<0||answer>2)fail('Selecciona una respuesta válida.');
  if(answer!==challenge.correct)fail('Esa respuesta todavía no resuelve el reto. Puedes volver a intentarlo gratis.');
  s.fieldMilestones??=[];
  if(s.fieldMilestones.includes(s.stageIndex)){changes.push('Reto de campo ya registrado');break;}
  // La recompensa se marca por etapa, NO por área: cambiar de mascota
  // durante la misma etapa no permite cobrar de nuevo el bono.
  s.fieldMilestones.push(s.stageIndex);
  const gained=addXp(s,Math.max(4,Math.min(45,Math.round(stage.target*.04))));
  s.pet.needs=applyNeedChanges(s.pet.needs,{motivation:2,curiosity:2});
  log(s,`🧭 Ruta ${AREA_ROUTES[s.areaId]?.title??'educativa'}: ${challenge.title} · +${gained} UPE`);
  changes.push(`Reto de campo completo · +${gained} UPE · +2 motivación`);
  if(s.stageIndex===13){
   const ending=branch?.ending??'Una nueva generación encuentra sus descubrimientos.';
   const trophy=`ruta-${s.areaId}-${s.areaPath??'general'}`;
   if(!s.achievements.includes(trophy))s.achievements.push(trophy);
   log(s,`🌟 Final de ruta: ${ending}`);
   changes.push(`Final de ruta: ${ending}`);
  }
  break;
 }
 // Personalización visual reversible: no reinicia edad, PA, créditos ni progreso.
 case 'pet.changeArea': {
  const nextArea=typeof payload.areaId==='string'?payload.areaId:'';
  if(!AREAS.some(([key])=>key===nextArea))fail('Esa área no está disponible.');
  if(s.areaId===nextArea)fail('La mascota ya pertenece a esa área.');
  // Los siete IDs anteriores no cambian. Si cambia de disciplina, se conserva
  // toda la economía y el progreso, pero la elección de especialidad se reinicia:
  // una rama ajena a la nueva área no puede aparecer como válida.
  // La elección anterior puede quedar fuera del nuevo catálogo; invalidarla
  // evita rutas fantasma. Los hitos completados siguen en el expediente
  // porque los premios ya cobrados no se pueden repetir por cambiar de área.
  s.areaId=nextArea;s.pet.appearanceId=nextArea;s.areaPath=undefined;
  log(s,`🎭 La mascota adoptó la apariencia de ${AREAS.find(([key])=>key===nextArea)?.[1]}`);
  changes.push('Área y especie actualizadas, elige nueva especialización; progreso intacto');break;
 }
 case 'pet.rename': {
  const name=typeof payload.petName==='string'?payload.petName.trim():'';
  if(name.length<1||name.length>28)fail('El nombre debe tener entre 1 y 28 caracteres.');
  s.pet.name=name;changes.push('Nombre actualizado');break;
 }
 // Deserción: final de una generación tras una crisis prolongada. Nueva oportunidad
 // explícita; conservar expediente/score permite aprender sin perder su historial.
 case 'career.restartAfterDropout': {
  if(!riskOf(s).dropoutAt)fail('La trayectoria no está interrumpida.');
  const previous={generation:s.generation,score:s.totalXp,maxStage:s.stageIndex,name:s.pet.name,outcome:'desercion' as const};
  const fresh=newGame(s.pet.name,s.areaId,s.difficultyId,s.generation+1);
  fresh.gameId=s.gameId;fresh.records=[...s.records,previous].slice(-40);
  fresh.history=[`🌱 ${s.pet.name} comienza otra oportunidad; la generación anterior conserva su expediente ficticio.`,...fresh.history];
  Object.assign(s,fresh);changes.push('Nueva oportunidad iniciada');break;
 }
 // Reinicio VOLUNTARIO: conserva récords y legado, sin final obligatorio al llegar a Emérito.
 case 'legacy.startGeneration': {
  if(s.stageIndex<9)fail('El modo legado se desbloquea desde Candidato SNII.');
  const name=typeof payload.newPetName==='string'?payload.newPetName.trim():'';
  if(!name||name.length>28)fail('Escribe un nombre válido para la siguiente generación.');
  const record={generation:s.generation,score:s.totalXp,maxStage:s.stageIndex,name:s.pet.name,outcome:'legado' as const};
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
