/**
 * @module ui/app
 * Capa de presentación sin reglas económicas: produce HTML y escucha eventos.
 * Una acción del usuario pasa por `execute()` -> `issueCommand()` -> IndexedDB.
 * NO editar `save.ap`, `save.credits`, etc. desde esta interfaz: cambiar
 * recursos únicamente en engine-game.ts para conservar pruebas e idempotencia.
 * Los textos provenientes de guardados/nombres deben escapar vía `esc()`.
 */
import { STAGES, CARE, AREAS, activitiesForStage, STAGE_GUIDES } from '../data/catalog.js';
import { PET_KINDS, petArea, petSprite, spriteFrame } from '../data/pet-visuals.js';
import { LEARNING_STAGES } from '../data/learning-path.js';
import { STEP_COUNT, learningSequence, masteredSteps } from '../data/learning-sequences.js';
import type { LearningStep } from '../data/learning-sequences.js';
import type { Activity } from '../data/stage-activities.js';
import { sceneForStage, stationIndex, stationsForStage, learningStation } from '../data/scene-world.js';
import { AREA_ROUTES, areaRouteDescription, branchOf, fieldChallenge } from '../data/area-routes.js';
import type { GameSave } from '../core/state.js';
import { newGame, STAGE_GATE } from '../core/engine-game.js';
import { DIFFICULTIES, difficultyOf, riskOf, vitalAlerts, criticalCount, studyBlocker, performanceFactor } from '../core/engine-health.js';
import { issueCommand } from '../core/game-coordinator.js';
import { moodForNeeds, reactionForCommand, REACTION_LOOK } from './pet-animation.js';
import type { PetReaction } from './pet-animation.js';
import { exportSave, getSave, initializeSave, parseImport } from '../core/persistence.js';
const root=document.querySelector<HTMLElement>('#app');
if(!root)throw Error('Falta #app.');
// Estado de pantalla (NO fuente persistente de verdad); cada comando vuelve a leer IDB.
let save:GameSave|null=null,tab='actividades',notice='',noticeError=false,busy=false;
/**
 * Estado efímero del reto pedagógico. No se guarda junto a la partida porque
 * responder una pregunta no altera puntos, decisiones ni progreso hasta ejecutar
 * `activity.execute` en el motor. Recargar descarta un reto no terminado.
 */
let guidedActivityId:string|null=null;
let guidedAnswer:number|null=null;
/** Paso mostrado; los pasos respondidos viven en IndexedDB, no aquí. */
let guidedStepIndex=0;
/** La mascota viaja visualmente al lugar de la actividad elegida. */
let sceneDestination:string|null=null,sceneWalkPending=false;
/** Preferencia visual independiente de la economía y del estado guardado. */
function dismissGuidedActivity():void {guidedActivityId=null;guidedAnswer=null;sceneDestination=null;sceneWalkPending=false;}
/** El progreso previo sobrevive a cerrar panel, recargar o regresar del cuidado. */
function openLearningActivity(activityId:string):void {
 // Resolver SIEMPRE por ID estable y etapa vigente, exactamente como la escena.
 const destination=learningStation(player().stageIndex,activityId);
 if(!destination)return;
 guidedActivityId=destination.activity.id;guidedAnswer=null;
 guidedStepIndex=masteredSteps(player().learningProgress,activityId);
 sceneWalkPending=sceneDestination!==activityId;
 sceneDestination=activityId;tab='actividades';render();focusGuidedActivity();
}
function focusGuidedActivity():void {root?.querySelector<HTMLElement>('#guided-learning')?.focus();}

/** Preferencia pequeña del dispositivo, separada de los guardados académicos. */
const MOTION_KEY='mascota-snii-motion';
function readMotionPreference():boolean {try{return localStorage.getItem(MOTION_KEY)!=='off'}catch{return true}}
let animationsEnabled=readMotionPreference();
/** Una reacción confirmada dura ~2 segundos; jamás se guarda ni modifica recursos. */
let reaction:PetReaction|null=null;
let reactionTimer:ReturnType<typeof setTimeout>|null=null;
function showReaction(next:PetReaction|null):void {
 if(reactionTimer!==null)clearTimeout(reactionTimer);
 reaction=next;
 if(!next)return;
 reactionTimer=setTimeout(()=>{
  if(reaction!==next)return;
  reaction=null;
  // Retirar solo los adornos temporales: NO repintar el panel ni perder foco.
  root?.querySelector('.pixel-pet')?.classList.remove(`reaction-${next}`);
  root?.querySelector('.pet-wrap')?.classList.remove(`reaction-${next}`);
  root?.querySelector('.pet-action-flash')?.remove();
 },2100);
}

/** Escapa HTML interpolado para evitar inyectar marcado desde nombres/resguardos JSON. */
const esc=(text:unknown)=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
const fmt=(n:number)=>Math.round(n).toLocaleString('es-MX');
const percent=(value:number,max=100)=>Math.max(0,Math.min(100,value/max*100));
const player=()=>save as GameSave;
const stage=()=>STAGES[player().stageIndex];
const notify=(msg:string,isError=false)=>{notice=msg;noticeError=isError;render()};
const meter=(label:string,value:number,color:string,reverse=false,max=100)=>`<div class="meter"><div class="meter-label"><span>${label}</span><strong>${fmt(value)}${max===100?'%':''}</strong></div><div class="meter-track"><i class="${color} ${reverse?'meter-reverse':''}" style="width:${percent(value,max)}%"></i></div></div>`;
const button=(action:string,id:string,label:string,disabled=false,extra='')=>`<button class="game-btn ${extra}" data-action="${action}" data-id="${esc(id)}" ${disabled?'disabled':''}>${label}</button>`;
/** Estado contextual por medidor: además del color, comunica consecuencias textuales. */
function vitalMeter(key:'energy'|'motivation'|'concentration'|'wellbeing'|'stress',label:string,color:string){
 const value=player().pet.needs[key],item=vitalAlerts(player().pet.needs).find(a=>a.key===key);
 return `<div class="vital-metric ${item?'vital-'+item.severity:''}">${meter(label,value,color,key==='stress')}${item?`<p class="vital-effect ${item.severity}">${item.severity==='critico'?'⛔':'⚠️'} ${esc(item.consequence)}</p>`:''}</div>`;
}
/** Consejos inmediatos + horas de crisis; no promete una recuperación instantánea. */
function healthPanel(){
 const s=player(),n=s.pet.needs,alerts=vitalAlerts(n),risk=riskOf(s),mode=difficultyOf(s.difficultyId);
 const blocker=studyBlocker(n),critical=criticalCount(n);
 const description=critical>=2?'Dos o más indicadores críticos: el riesgo aumenta con el tiempo.':risk.criticalHours>0?'La crisis ha disminuido; mantener el equilibrio reduce el riesgo.':'Los indicadores están relativamente estables.';
 const preferred=alerts[0];
 // Si no hay créditos, ofrecer cuidado gratis para evitar bloqueos sin salida.
 const suggested=preferred?({'energy':'dormir','motivation':'socializar','concentration':'descansar','wellbeing':'recrear','stress':'recrear'} as const)[preferred.key]:null;
 const care=s.credits<=0&&suggested&&['socializar','recrear'].includes(suggested)?'acompanar':suggested;
 const careLabel=care==='acompanar'?'Acompañar (gratis)':preferred?.suggestedCare;
 const state=critical>=2||risk.criticalHours>=9?'danger':alerts.length?'caution':'ok';
 const ceiling=mode.dropoutHours;
 return `<section class="health-panel health-${state}" aria-label="Consecuencias y dificultad">
  <div class="health-top"><strong>${state==='danger'?'🚨 Crisis académica':state==='caution'?'⚠️ Atención al bienestar':'✅ Condición equilibrada'}</strong><span>${esc(mode.label)}</span></div>
  <p>${esc(blocker||description)}</p>
  ${alerts.length?`<ul class="health-list">${alerts.slice(0,3).map(a=>`<li>${a.label}: ${esc(a.suggestedCare)}</li>`).join('')}</ul>`:''}
  ${ceiling!==null?`<div class="crisis-progress" role="progressbar" aria-label="Tiempo acumulado de crisis académica" aria-valuemin="0" aria-valuemax="${ceiling}" aria-valuenow="${Math.min(ceiling,Number(risk.criticalHours.toFixed(1)))}"><i style="width:${percent(risk.criticalHours,ceiling)}%"></i></div><small>Riesgo de deserción: ${risk.criticalHours.toFixed(1)} / ${ceiling} horas críticas acumuladas</small>`:'<small>Modo tranquilo: puede haber bloqueos, pero no deserción definitiva.</small>'}
  ${care?button('care',care,`💚 Cuidar ahora: ${esc(careLabel)}`,busy,'health-care'):''}
 </section>`;
}
/** Final satírico no violento con respaldo y nueva generación sin borrar récords. */
function dropoutScreen(){const s=player(),r=riskOf(s);return `<main class="dropout-screen" role="main"><div class="dropout-card"><span class="eyebrow">📕 FIN DE UNA GENERACIÓN · SIMULACIÓN FICTICIA</span><h1>Una pausa en la trayectoria de ${esc(s.pet.name)}</h1><p>${esc(r.reason||'La mascota interrumpió su trayectoria académica.')}</p><div class="dropout-stats"><span>Etapa: <strong>${esc(stage().label)}</strong></span><span>Progreso: <strong>${fmt(s.totalXp)} UPE</strong></span><span>Generación: <strong>${s.generation}</strong></span></div><p>La deserción es una consecuencia del juego, no un juicio sobre estudiantes reales. Tus récords se conservan si comienzas de nuevo.</p><div class="dropout-actions">${button('restart','', '🌱 Nueva oportunidad: reiniciar trayectoria',busy,'primary')}${button('export','', '📥 Descargar expediente antes de reiniciar',busy)}</div></div></main>`;}

/** Sprite original: especie por área + cuadro de evolución por etapa.
 * El cuadro nunca modifica el guardado; es una representación de stageIndex.
 */
function avatar(){
 const s=player(),area=petArea(s.areaId),kind=PET_KINDS[area],mood=moodForNeeds(s.pet.needs);
 const feedback=reaction?REACTION_LOOK[reaction]:null;
 // Las 14 evoluciones del sprite son intactas; solo cambia transform/opacity en CSS.
 return `<div class="pet-wrap sprite-wrap mood-${mood.mood} ${reaction?`reaction-${reaction}`:''}" role="img" aria-label="${esc(s.pet.name)}: ${esc(kind.name)}, ${esc(stage().label)}. ${esc(mood.label)}. ${esc(mood.hint)}">
  <div class="pixel-orb orb-one" aria-hidden="true"></div><div class="pixel-orb orb-two" aria-hidden="true"></div>
  <div class="pixel-pet mood-${mood.mood} ${reaction?`reaction-${reaction}`:''}" style="background-position:${spriteFrame(s.stageIndex)*100/13}% 0;background-image:url('${petSprite(area)}')" aria-hidden="true"></div>
  <span class="pet-emotion-icon" aria-hidden="true">${mood.symbol}</span>
  ${feedback?`<span class="pet-action-flash" aria-hidden="true">${feedback.symbol}<small>${esc(feedback.description)}</small></span>`:''}
  <span class="pet-floor" aria-hidden="true"></span><span class="species-label" style="--species-color:${kind.accent}">${kind.icon} ${esc(kind.name)}</span></div>`;
}
/** Formulario de creación; cada área elige una especie pero ninguna ventaja de balance. */
function creation(){
 return `<div class="startup"><div class="startup-art">🎓 <span>✦</span> 🔬</div><div class="startup-card"><div class="eyebrow">★ LABORATORIO DE LO IMPROBABLE · EDICIÓN EDUCATIVA 1.0</div>
 <h1>Tu carrera científica<br><em>empieza en Kínder.</em></h1><p>Elige la especie de tu futura investigadora o investigador. Cada área tiene una mascota diferente y 14 apariencias que evolucionan con sus aprendizajes.</p>
 <form id="create-form"><label for="pet-name">Nombre de la mascota</label><input id="pet-name" name="petName" maxlength="28" minlength="1" required value="Curiosín" autocomplete="off" />
 <fieldset class="area-fieldset"><legend>Elige un área y una especie</legend><div class="area-gallery">${AREAS.map(([id,label,icon])=>{
  const kind=PET_KINDS[petArea(id)];return `<label class="area-choice"><input type="radio" name="area" value="${id}" ${id==='biologia'?'checked':''} required /><span class="area-card">
   <span class="area-pixel" style="background-image:url('${petSprite(id)}')" aria-hidden="true"></span>
   <strong>${esc(kind.name)}</strong><small>${icon} ${esc(label)}</small><span class="area-traits">${esc(kind.traits)}</span></span></label>`;
 }).join('')}</div></fieldset>
 <fieldset class="difficulty-fieldset"><legend>Elige la dificultad de cuidado</legend><div class="difficulty-gallery">${DIFFICULTIES.map(d=>`<label class="difficulty-choice"><input type="radio" name="difficulty" value="${d.id}" ${d.id==='normal'?'checked':''} required /><span><strong>${esc(d.label)}</strong><small>${esc(d.description)}</small></span></label>`).join('')}</div></fieldset>
 <button type="submit" class="primary huge" ${busy?'disabled':''}>Adoptar mascota científica <span>→</span></button></form>
 <div class="startup-foot">9 mascotas y 126 evoluciones · Partida local · Criterios ficticios, no oficiales.</div></div></div>`;
}
/**
 * Muestra una experiencia pedagógica junto al catálogo académico.
 * El primer reto es original y los cuatro siguientes se basan en perfiles
 * pedagógicos redactados para cada actividad, sin importar su dificultad.
 * Las preguntas NO calculan recompensas ni escriben estado directamente.
 */
function guidedLearningPanel(sequence:readonly LearningStep[],activity:Activity,cost:number,unavailable:boolean){
 const activityId=activity.id;
 const s=player(),learned=masteredSteps(s.learningProgress,activityId),mastered=learned===STEP_COUNT;
 const station=learningStation(s.stageIndex,activityId);
 const step=sequence[Math.min(guidedStepIndex,STEP_COUNT-1)];
 const submitted=guidedAnswer!==null,correct=submitted&&guidedAnswer===step.correct&&!!s.learningProgress?.[activityId]?.includes(step.stepIndex);
 const recorded=!!s.learningProgress?.[activityId]?.includes(step.stepIndex);
 const readyForNext=recorded&&learned<STEP_COUNT;
 const firstReward=!(s.learningRewarded??[]).includes(activityId);
 return `<section id="guided-learning" class="guided-learning" tabindex="-1" aria-label="Aventura educativa de cinco pasos">
 <div class="guided-top"><span class="mission-label">🎲 EXPEDICIÓN DE ${esc(stage().short.toUpperCase())} · ${learned}/${STEP_COUNT} DESCUBRIMIENTOS</span><button class="guided-close" data-action="learn-close" aria-label="Cerrar ${esc(activity.label)}">✕ Cerrar</button></div>
 <div class="guided-identity" aria-live="polite"><span class="guided-identity-icon" aria-hidden="true">${esc(activity.icon)}</span><div><span class="guided-identity-station">ESTACIÓN ${station?station.index+1:'?'} DE 6 · ${esc(stage().label)} · Actividad seleccionada</span><h3>${esc(activity.label)}</h3><p>${esc(activity.flavor)}</p></div></div>
 <div class="learning-steps" aria-label="Respuestas acertadas">${sequence.map((_,i)=>`<span class="learning-step ${s.learningProgress?.[activityId]?.includes(i)?'done':i===guidedStepIndex?'current':''}" aria-label="Paso ${i+1}: ${s.learningProgress?.[activityId]?.includes(i)?'resuelto':'pendiente'}">${s.learningProgress?.[activityId]?.includes(i)?'✓':i+1}</span>`).join('')}</div>
 <div class="learning-step-track" role="progressbar" aria-label="Progreso de aventura" aria-valuemin="0" aria-valuemax="5" aria-valuenow="${learned}"><i style="width:${percent(learned,STEP_COUNT)}%"></i></div>
 ${mastered?`<div class="mastery-celebration" role="status"><strong>🏅 ¡Aventura completada: ${esc(activity.label)}!</strong><p>¡Cinco descubrimientos! Ya puedes repetir esta actividad cuando lo desees, o explorar otra estación. ${firstReward?'La primera práctica guiada ofrece +25 % de UPE.':''}</p></div><details class="mastered-review"><summary>📖 Consultar las cinco preguntas de ${esc(activity.label)} (sin costo)</summary><ol>${sequence.map(item=>`<li><strong>${esc(item.question)}</strong><p>✅ ${esc(item.options[item.correct])}</p><p>${esc(item.explanation)}</p></li>`).join('')}</ol><p>Repasar es gratuito y no modifica tus puntos ni borra tus aciertos.</p></details>`:`<div class="guided-story"><span aria-hidden="true">${esc(stage().emblem)}</span><div><strong>Descubrimiento ${step.stepIndex+1} de ${STEP_COUNT} · ${esc(s.pet.name)} pregunta:</strong><p>«${esc(step.scene)}»</p></div></div>
 <h3>${esc(step.question)}</h3>
 <p class="guided-instruction">Busca una solución con tu mascota. Las respuestas incorrectas no gastan PA y puedes probar otra vez.</p>
 <div class="guided-options" role="group" aria-label="Opciones del desafío">${step.options.map((option,index)=>`<button class="guided-option ${submitted&&index===guidedAnswer?(correct?'is-correct':'is-incorrect'):''}" data-action="learn-answer" data-id="${index}" ${busy||recorded?'disabled':''} aria-pressed="${submitted&&index===guidedAnswer}"><span>${index===0?'A':index===1?'B':'C'}</span>${esc(option)}</button>`).join('')}</div>
 ${submitted?`<div class="guided-feedback ${correct?'success':'try-again'}" role="status" aria-live="polite"><strong>${correct?'✨ ¡Lo has descubierto!':'🌱 Buena exploración; prueba otra idea.'}</strong><p>${esc(correct?step.explanation:step.hint)}</p></div>`:''}
 ${readyForNext?`<button class="game-btn primary guided-next-step" data-action="learn-next">➡️ Siguiente descubrimiento (${learned+1}/${STEP_COUNT})</button>`:''}`}
 ${mastered?`<div class="guided-next"><p>Ya están guardados tus cinco aciertos. <strong>Solo al practicar</strong> se cobran ${cost} PA y se otorgan UPE. ${firstReward?'La primera práctica concede un bono moderado; las siguientes se ajustan al rendimiento y a las repeticiones.':''}</p><button class="game-btn primary guided-practice" data-action="guided-execute" data-id="${esc(activityId)}" ${unavailable?'disabled':''}>${unavailable?'⏸ Necesita recuperarse para practicar':'⭐ ¡Practicar lo aprendido!'}</button>${unavailable?'<p class="guided-rest-note">Puedes descansar, cuidar a tu mascota y volver. No perderás tus cinco aciertos.</p>':''}</div>`:''}
 </section>`;
}

/**
 * Guía narrativa de etapa: explica el propósito de la educación, vincula un
 * ejemplo con la vida cotidiana y diferencia apoyo de la persona jugadora.
 */
function activityPanel(){
 const s=player(),list=activitiesForStage(s.stageIndex),chapter=LEARNING_STAGES[s.stageIndex];
 const chosen=guidedActivityId?list.find(a=>a.id===guidedActivityId):undefined;
 const sequence=chosen?learningSequence(chosen.id):[];
 const guidedCost=chosen?Math.max(1,Math.ceil(chosen.pa*stage().cost*(s.pet.needs.wellbeing<=25?1.2:1))):0;
 const guidedUnavailable=busy||!!s.event||!!studyBlocker(s.pet.needs)||s.ap<guidedCost||!!chosen&&s.credits+chosen.credits<0;
 const chapterSolved=list.reduce((sum,activity)=>sum+masteredSteps(s.learningProgress,activity.id),0);
 const badges=list.filter(activity=>masteredSteps(s.learningProgress,activity.id)===STEP_COUNT).length;
 return `<div class="panel-heading"><div><span class="eyebrow">📖 CAPÍTULO ${s.stageIndex+1} DE 14 · ${esc(stage().label.toUpperCase())}</span><h2>${esc(chapter.chapter)}</h2><p>¡Tu mascota aprende contigo! Tú decides cómo acompañarla; ella descubre, practica y crece.</p></div><span class="tiny-pill">${list.length} aventuras</span></div>
  <section class="learning-intro" aria-label="¿Qué se aprende en esta etapa?">
   <div class="learning-banner"><span class="learning-spark" aria-hidden="true">✦</span><div><strong>${esc(chapter.hook)}</strong><p>«¡Hola! Soy ${esc(s.pet.name)}. ¿Me ayudas a descubrir algo hoy?»</p></div></div>
   <div class="learning-purpose"><strong>🎯 Aprenderemos:</strong> ${esc(chapter.purpose)}</div><details class="learning-about"><summary>🧠 ¿Qué significa esta etapa de aprendizaje?</summary><p>${esc(chapter.whatHappens)}</p><p><strong>🤝 Tu papel:</strong> ${esc(chapter.companion)}</p></details>
   <div class="learning-reality"><strong>🔎 ¿Dónde lo vemos en la vida real?</strong><p>${esc(chapter.realWorld)}</p></div>
   <p class="learning-motto">💡 ${esc(chapter.closing)}</p>
  </section>
  <section class="area-story" aria-label="Ruta de conocimiento de esta etapa"><strong>🧭 Tu aventura en ${esc((AREA_ROUTES[s.areaId]??AREA_ROUTES.biologia).title)}</strong><p>${esc(areaRouteDescription(s.areaId,s.stageIndex,s.areaPath))}</p><p class="muted">Un reto de campo distinto en cada etapa, además de las seis estaciones. Puedes encontrarlo en la pestaña Carrera.</p>${button('tab','carrera','🧭 Explorar mi ruta',busy)}</section>
  <section class="chapter-collection" aria-label="Colección de descubrimientos de la etapa"><div><strong>📔 Álbum de descubrimientos</strong><span>🏅 ${badges}/6 aventuras dominadas · ${chapterSolved}/30 aciertos</span></div><div class="learning-step-track" role="progressbar" aria-label="Colección de etapa" aria-valuemin="0" aria-valuemax="30" aria-valuenow="${chapterSolved}"><i style="width:${percent(chapterSolved,30)}%"></i></div><p>${chapterSolved===30?'✨ ¡Completaste las seis aventuras de la etapa! Puedes seguir practicando o avanzar cuando cumplas los requisitos de carrera.':'Avanza a tu ritmo: puedes probar distintas aventuras y continuar después sin perder tus aciertos.'}</p></section>
  <div class="learning-heading"><div><h3>🗺️ Elige una aventura</h3><p>Cada actividad incluye cinco descubrimientos; al dominarlos podrás repetir la práctica. Tus respuestas se guardan.</p></div><span class="learning-no-cost">🎲 Descubrir es gratis</span></div>
  ${sequence.length===STEP_COUNT&&chosen?guidedLearningPanel(sequence,chosen,guidedCost,guidedUnavailable):''}
  ${studyBlocker(s.pet.needs)?`<div class="activity-blocked" role="alert">⛔ ${esc(studyBlocker(s.pet.needs))} Puedes explorar los retos sin gastar recursos; para practicar primero cuida a tu mascota.</div>`:''}
  <div class="activity-grid learning-activities">${list.map(a=>{
   const cost=Math.max(1,Math.ceil(a.pa*stage().cost*(s.pet.needs.wellbeing<=25?1.2:1)));
   const unavailable=busy||!!s.event||!!studyBlocker(s.pet.needs)||s.ap<cost||s.credits+a.credits<0;
   const ready=learningSequence(a.id).length===STEP_COUNT,learned=masteredSteps(s.learningProgress,a.id),mastered=learned===STEP_COUNT;
   return `<article class="activity learning-activity ${chosen?.id===a.id?'learning-activity-selected':''}" data-station-id="${esc(a.id)}" aria-label="${esc(a.label)}${chosen?.id===a.id?' seleccionada':''}"><span class="action-icon" aria-hidden="true">${a.icon}</span><div class="action-body"><strong>${esc(a.label)}</strong><small>${esc(a.flavor)}</small><small>⭐ UPE base: ${a.pe} · 🪙 CR: ${a.credits>=0?'+':''}${a.credits} · ⚡ ${cost} PA</small><small class="activity-learning-progress">${mastered?'🏅 Dominada · Repetir disponible':`📖 ${learned}/${STEP_COUNT} preguntas acertadas`}</small></div><div class="learning-actions"><button class="game-btn learn-start" data-action="learn" data-id="${esc(a.id)}" ${busy||!ready?'disabled':''}>${mastered?'📘 Repasar aventura':`🎲 Aventura ${learned}/${STEP_COUNT}`}</button><button class="game-btn learn-fast" data-action="activity" data-id="${esc(a.id)}" ${unavailable||!mastered?'disabled':''} title="${mastered?'Practicar de nuevo gastando PA':'Desbloquea esta opción tras acertar las cinco preguntas'}" aria-label="Repetir ${esc(a.label)}, ${cost} PA">⚡ Repetir</button></div></article>`;
  }).join('')}</div><p class="muted">Las actividades de juego y los UPE son ficticios. Los mini retos enseñan ideas generales, no otorgan calificaciones reales ni representan criterios oficiales del SNII.</p>`;
}
/**
 * Recorrido educativo por área: escenario temático desde Kínder y dos ramas
 * elegibles desde Universidad. El motor confirma una única recompensa por etapa;
 * estos botones no modifican directamente el guardado ni la economía.
 */
function areaCareerPanel():string {
 const s=player(),data=AREA_ROUTES[s.areaId]??AREA_ROUTES.biologia;
 const branch=branchOf(s.areaId,s.areaPath);
 // El hito se consulta por índice de etapa y es transversal a cambios
 // de área: la UI debe reflejar el mismo bloqueo que hace cumplir el motor.
 const completed=(s.fieldMilestones??[]).includes(s.stageIndex);
 const challenge=fieldChallenge(s.areaId,s.stageIndex,s.areaPath);
 const specialization=s.stageIndex>=4&&!branch;
 const chooser=s.stageIndex>=4?(branch?
  `<p class="area-branch-confirmed">🧭 Especialización: <strong>${esc(branch.label)}</strong> · ${esc(branch.goal)}</p>`:
  `<div class="area-branch-list"><h4>Elige una de dos rutas posibles</h4>${data.branches.map(item=>`<div class="area-branch-choice"><strong>${esc(item.label)}</strong><p>${esc(item.goal)}</p>${button('choose-route',item.id,'Elegir esta ruta',busy)}</div>`).join('')}</div>`):
  `<p>La especialización se elige al llegar a Universidad. Por ahora explora las bases de tu disciplina.</p>`;
 return `<section class="area-route-panel" aria-label="Ruta educativa por área">
  <span class="eyebrow">${esc(data.emblem)} ÁREA ${esc(data.title.toUpperCase())}</span>
  <h3>🌿 ${esc(challenge.title)}</h3>
  <p>${esc(data.introduction)}</p><p><strong>Experiencia de ${esc(stage().label)}:</strong> ${esc(challenge.scene)}</p>
  ${chooser}
  <div class="field-challenge"><strong>🔎 Reto de campo · ${completed?'✅ completado':'pendiente'} · Etapa ${s.stageIndex+1}/14</strong>
  ${completed?`<p>¡Este descubrimiento ya está registrado! Puedes seguir con las seis aventuras de tu etapa.</p>`:specialization?'<p>Elige una especialización para activar el reto de esta etapa.</p>':
  `<p>${esc(challenge.question)}</p><details><summary>💡 Pista educativa</summary><p>${esc(challenge.hint)}</p></details><div class="field-options">${challenge.options.map((option,i)=>button('field-answer',String(i),`${String.fromCharCode(65+i)}. ${esc(option)}`,busy,'field-choice')).join('')}</div><small>No consume PA; un único bono de UPE por etapa. Las respuestas equivocadas permiten reintentar.</small>`}
  </div>${s.stageIndex===13&&completed&&branch?`<p class="area-ending">🌟 ${esc(branch.ending)}</p>`:''}
 </section>`;
}
/** Presenta requisitos lúdicos de transición; motor los vuelve a validar al confirmar. */
function careerPanel(){
 const s=player(),st=stage(),target=STAGES[s.stageIndex+1];
 const needed=STAGE_GATE(s.stageIndex);const okay=s.stageXp>=st.target&&s.evidence>=needed&&s.pet.needs.competence>=50&&riskOf(s).criticalHours<9;
 return `<div class="panel-heading"><div><h2>Mapa de trayectoria</h2><p>14 etapas de juego; cada etapa requiere UPE y evidencias ficticias.</p></div><span class="tiny-pill">ETAPA ${s.stageIndex+1}/14</span></div>
 ${areaCareerPanel()}
 <div class="timeline">${STAGES.map((item,i)=>`<div class="stage-node ${i===s.stageIndex?'current':i<s.stageIndex?'done':''}"><span class="stage-icon">${item.emblem}</span><div><strong>${esc(item.label)}</strong><small>${i===s.stageIndex?'Etapa actual':i<s.stageIndex?'Completada':'Por desbloquear'} · ${fmt(item.target)} UPE</small></div><span class="stage-status">${i===s.stageIndex?'●':i<s.stageIndex?'✓':'○'}</span></div>`).join('')}</div>
 <div class="transition"><h3>${target?`Siguiente etapa: ${esc(target.label)}`:'¡Alcanzaste Emérito!'}</h3><p>Progreso ${fmt(s.stageXp)} / ${fmt(st.target)} UPE · Evidencias ${s.evidence} / ${needed} · Competencia ${fmt(s.pet.needs.competence)} / 50</p>
 ${target?button('advance','', '🎓 Solicitar avance de etapa',!okay||busy,'primary'): '<p>Puedes continuar acumulando progreso o elegir iniciar una nueva generación en Legado.</p>'}</div>`;
}
/** Visualiza proyectos; las evidencias únicamente se conceden al ejecutar el comando. */
function projectsPanel(){
 const s=player();return `<div class="panel-heading"><div><h2>Bitácora de proyectos</h2><p>Las actividades nutren tu proyecto. Entregarlo genera evidencias, no reconocimientos oficiales.</p></div></div>
 <div class="project-card"><div class="project-art">📁<span> ✧</span></div><div class="project-info"><span class="eyebrow">PROYECTO EN CURSO</span><h3>${esc(s.projectName)}</h3><p>${esc(STAGE_GUIDES[s.stageIndex].description)}</p>${meter('Avance del proyecto',s.projectProgress,'mint')}${button('submit','',s.projectProgress>=100?'✓ Entregar proyecto (+2 evidencias y 12 CR)':'Completa el proyecto para entregar',s.projectProgress<100||busy,'primary')}</div></div>
 <div class="stat-grid"><div class="small-stat"><span>📄 Evidencias</span><strong>${s.evidence}</strong></div><div class="small-stat"><span>✅ Proyectos cerrados</span><strong>${s.completedProjects}</strong></div><div class="small-stat"><span>🎯 Acciones</span><strong>${s.actions}</strong></div></div>`;
}
/** Historial y legado voluntario: no hay pantalla de fin obligatorio. */
function legacyPanel(){
 const s=player();return `<div class="panel-heading"><div><h2>Legado y expedientes</h2><p>Puedes elegir un legado voluntario; las crisis académicas prolongadas pueden interrumpir una generación según la dificultad.</p></div></div>
 <div class="legacy-hero"><div class="legacy-icon">🏛️</div><div><span class="eyebrow">ARCHIVO HISTÓRICO</span><h3>Generación ${s.generation}</h3><p>${esc(s.pet.name)} · ${esc(stage().label)} · ${fmt(s.totalXp)} UPE históricos</p></div></div>
 <div class="achievements"><h3>🏅 Logros (${s.achievements.length})</h3><div class="pill-row">${s.achievements.length?s.achievements.map(a=>`<span class="achievement">✦ ${esc(a.replaceAll('-',' '))}</span>`).join(''):'<span class="muted">Los logros llegarán con tus primeras aventuras.</span>'}</div></div>
 <div class="record-list"><h3>Récords anteriores</h3>${s.records.length?s.records.slice().reverse().map(r=>`<div class="record"><strong>Generación ${r.generation} — ${esc(r.name)} ${r.outcome==='desercion'?'· 📕 Interrumpida':'· 🌱 Legado'}</strong><span>${fmt(r.score)} UPE · ${esc(STAGES[r.maxStage]?.short||'—')}</span></div>`).join(''):'<p class="muted">Todavía no hay generaciones anteriores.</p>'}</div>
 <div class="legacy-action"><p>Desbloqueas un nuevo comienzo al llegar a Candidato SNII. Es opcional; tu partida no termina sola.</p><label for="legacy-name">Nombre de la siguiente generación</label><div class="inline-form"><input id="legacy-name" maxlength="28" value="Nueva curiosidad" />${button('legacy','', '🌱 Iniciar legado',s.stageIndex<9||busy,'primary')}</div></div>`;
}
/** Respaldo local, importación confirmada y personalización cosmética. */
function archivePanel(){
 const s=player();return `<div class="panel-heading"><div><h2>Tu expediente personal</h2><p>Datos locales: controla tus copias. No hay cuenta ni sincronización en la nube.</p></div></div>
 <div class="archive-actions"><div><h3>📥 Exportar partida</h3><p>Guarda un archivo JSON para respaldar tu trayectoria.</p>${button('export','', 'Descargar respaldo',busy)}</div><div><h3>📤 Importar partida</h3><p>Reemplaza la partida actual después de confirmar. Compatible con formato v2.</p><label for="import-file" class="file-label">Elegir JSON…</label><input type="file" id="import-file" accept=".json,application/json" /></div></div>
 <div class="species-settings"><h3>🎨 Cambiar especie / área visual</h3><p>Las nueve áreas tienen mascotas y rutas educativas distintas. Cambiar de área conserva PA, UPE, etapa y proyectos, pero reinicia la especialización elegida para esta generación.</p><div class="species-controls"><select id="species-choice" aria-label="Área visual de la mascota">${AREAS.map(([key,label])=>`<option value="${key}" ${s.areaId===key?'selected':''}>${esc(PET_KINDS[petArea(key)].name)} · ${esc(label)}</option>`).join('')}</select>${button('species','', 'Cambiar especie',busy)}</div></div>
 <div class="meta"><p><strong>ID de partida:</strong> <code>${esc(s.gameId)}</code></p><p><strong>Revisión:</strong> ${s.revision} · <strong>Esquema:</strong> ${s.schemaVersion} · <strong>Balance:</strong> ${esc(s.balanceVersion)}</p><p><strong>Guardado:</strong> IndexedDB en este dispositivo · <strong>Dificultad:</strong> ${esc(difficultyOf(s.difficultyId).label)}</p><p><strong>Normativa:</strong> Sin validación oficial — mecánica satírica y educativa</p></div>
 <div class="timeline-log"><h3>Últimos movimientos</h3>${s.history.map(h=>`<div class="log-item">${esc(h)}</div>`).join('')}</div>`;
}
function eventModal(){const e=player().event;if(!e)return '';return `<div class="modal-backdrop"><div class="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-title"><span class="eyebrow">⚡ EVENTO IMPROBABLE</span><h2 id="event-title">${esc(e.title)}</h2><p>${esc(e.body)}</p><div class="event-choices">${e.options.map(o=>button('event',o.id,`${esc(o.label)}<small> ${o.credits} CR · ${o.pe} UPE base</small>`,busy)).join('')}</div></div></div>`}
/**
 * Estaciones de la etapa en el paisaje. Pulsarlas abre aprendizaje guiado.
 * Son puntos de navegación, no comandos; elegir un lugar nunca cobra recursos.
 */
function sceneEnvironment():string {
 const s=player(),world=sceneForStage(s.stageIndex),stations=stationsForStage(s.stageIndex),area=AREA_ROUTES[s.areaId]??AREA_ROUTES.biologia;
 return `<div class="world-landscape" aria-hidden="true"><span class="world-cloud">☁️</span><span class="world-hill"></span><span class="world-landscape-item a">${esc(world.decoration[0])}</span><span class="world-landscape-item b">${esc(world.decoration[1])}</span><span class="world-landscape-item c">${esc(world.decoration[2])}</span></div>
 <div class="world-heading"><strong>🗺️ ${esc(world.title)}</strong><span>${esc(world.ambient)} · ${esc(area.emblem)} ${esc(area.setting)}</span></div>
 <div class="area-world-mark" aria-hidden="true">${esc(area.emblem)} ${esc(area.mentor)}</div><div class="world-stations" aria-label="Lugares interactivos de aprendizaje">${stations.map(({activity:a,index:i})=>`<button class="world-station station-${i} ${guidedActivityId===a.id?'selected':''}" data-action="scene-go" data-id="${esc(a.id)}" aria-pressed="${guidedActivityId===a.id}" ${guidedActivityId===a.id?'aria-controls="guided-learning"':''} aria-label="Abrir aventura: ${esc(a.label)}" title="${esc(a.label)}"><span aria-hidden="true">${a.icon}</span><small>${esc(a.label)}</small></button>`).join('')}</div>`;
}
/** Distancias fijas para que el movimiento sea CSS, sin canvas ni física pesada. */
function travelOffset():{x:number;y:number} {
 if(!save||!sceneDestination)return {x:0,y:0};
 const idx=stationIndex(save.stageIndex,sceneDestination);
 const offsets=[[-78,-24],[78,-24],[-92,17],[92,17],[-70,50],[70,50]];
 const [x,y]=offsets[idx]??[0,0];return {x,y};
}
function dashboard(){const s=player(),n=s.pet.needs,st=stage(),mood=moodForNeeds(n);
 return `<div class="app-frame ${animationsEnabled?'':'motion-paused'}"><header class="topbar"><div class="brand"><div class="brand-mark">🧪</div><div><span class="eyebrow">ESTACIÓN DE INVESTIGACIÓN 001</span><h1>Tamagotchi <em>Académico</em></h1></div></div><div class="top-right"><span class="online-dot"></span><span class="save-label">Guardado local</span><span class="version-tag">MVP 1.0</span></div></header>
 <div class="notice-banner">UN JUEGO SATÍRICO · Los puntajes y criterios son <strong>ficticios</strong>; no evalúan oficialmente el SNII.</div>
 <div class="workspace"><aside class="left-sidebar"><div class="panel sidebar-top"><div class="panel-title">ESTADO VITAL <span>✦</span></div>
 ${vitalMeter('energy','⚡ Energía','yellow')}${vitalMeter('motivation','💖 Motivación','pink')}${vitalMeter('concentration','🎯 Concentración','purple')}${vitalMeter('wellbeing','🌿 Bienestar','mint')}${vitalMeter('stress','🌡️ Estrés','red')}
 ${healthPanel()}<details class="other-needs"><summary>Otras capacidades ▾</summary>${meter('🔎 Curiosidad',n.curiosity,'purple')}${meter('🧠 Competencia',n.competence,'mint')}${meter('🤝 Socialización',n.socialization,'pink')}${meter('⚖️ Integridad',n.scientificIntegrity,'yellow')}</details></div>
 <div class="panel care-panel"><div class="panel-title">CUIDAR A ${esc(s.pet.name).toUpperCase()}</div><p class="mini-description">El cuidado no consume PA.</p><div class="care-grid">${CARE.map(c=>button('care',c.id,`${c.icon} <span>${esc(c.label)}</span>`,busy,'care-btn')).join('')}</div></div>
 <div class="panel automation-panel"><div class="panel-title">ASISTENTE ACADÉMICO <span>🤖</span></div><p>${s.stageIndex<4?'Disponible a partir de Universidad.':s.automation?'Apoya proyectos durante ausencias. Consume créditos de mantenimiento.':'Actívalo por 35 CR; su producción está limitada.'}</p>${s.stageIndex>=4?button(s.automation?'auto-off':'auto-on','',s.automation?'Desactivar asistente':'Activar asistente (35 CR)',busy):''}</div></aside>
 <main class="center"><div class="pet-scene world-${esc(sceneForStage(s.stageIndex).landscape)} area-${esc(s.areaId)} mood-${mood.mood} ${studyBlocker(n)?'scene-crisis':vitalAlerts(n).length?'scene-warning':'scene-good'}"><div class="scene-top"><span class="scene-label">✧ ${esc(PET_KINDS[petArea(s.areaId)].name).toUpperCase()}</span><span class="scene-tools"><button class="motion-toggle" data-action="motion" aria-pressed="${animationsEnabled}" title="El sistema también respeta la preferencia de movimiento reducido del dispositivo">${animationsEnabled?'⏸ Pausar movimiento':'▶ Activar movimiento'}</button><span class="scene-time">GENERACIÓN ${s.generation}</span></span></div>${sceneEnvironment()}<div class="pet-travel ${sceneDestination&&stationIndex(s.stageIndex,sceneDestination)>=0?'at-station':''} ${sceneWalkPending?'is-walking':''}" style="--travel-x:${travelOffset().x}px;--travel-y:${travelOffset().y}px">${avatar()}</div>
 <div class="pet-caption"><span class="mood-tag">${mood.symbol} ${esc(mood.label)}</span><h2>${esc(s.pet.name)}</h2><p>${st.emblem} ${esc(st.label)} · Evolución ${s.stageIndex+1}/14</p><p class="pet-mood-hint">${esc(mood.hint)}</p><p class="pet-learning-hint">📖 ${esc(LEARNING_STAGES[s.stageIndex].hook)}</p><p class="area-focus-hint">${esc(areaRouteDescription(s.areaId,s.stageIndex,s.areaPath))}</p>${mood.signals.length?`<div class="pet-vital-signals" aria-label="Necesidades que requieren atención">${mood.signals.map(signal=>`<span class="pet-signal ${signal.severe?'critical':'warning'}">${signal.icon} ${esc(signal.label)}${signal.severe?' · crítico':''}</span>`).join('')}</div>`:''}</div></div>
 <div class="resource-cards"><div class="resource-card"><span>⚡ PUNTOS DE ACCIÓN</span><strong>${fmt(s.ap)} <small>/ ${st.maxAP}</small></strong><div class="micro-track"><i style="width:${percent(s.ap,st.maxAP)}%"></i></div><small>${s.ap>=st.maxAP?'PA completos':`+1 PA en aproximadamente ${Math.ceil((1-(s.apRegenRemainder??0))*60/st.apPerHour)} min`}</small></div><div class="resource-card"><span>🪙 CRÉDITOS</span><strong>${fmt(s.credits)}</strong><small>Fondos imaginarios</small></div><div class="resource-card"><span>⭐ UPE DE ETAPA</span><strong>${fmt(s.stageXp)} <small>/ ${fmt(st.target)}</small></strong><div class="micro-track violet"><i style="width:${percent(s.stageXp,st.target)}%"></i></div></div></div>
 <div class="panel stage-progress"><div class="progress-header"><div><span class="eyebrow">PROGRESO DE CARRERA</span><h3>${esc(st.label)} ${s.stageIndex<13?'→ '+esc(STAGES[s.stageIndex+1].short):'· Modo continuo'}</h3></div><span>${fmt(percent(s.stageXp,st.target))}%</span></div><div class="progress-track"><i style="width:${percent(s.stageXp,st.target)}%"></i></div><p>📄 Evidencias: ${s.evidence}/${STAGE_GATE(s.stageIndex)} · 🎯 Competencia: ${fmt(n.competence)}/50 · 🔁 Racha: ${s.streak+1} · ⚙️ Rendimiento vital: ${Math.round(performanceFactor(n)*100)} %</p></div>
 <div class="panel mini-log"><div class="panel-title">ÚLTIMA NOTA DE LABORATORIO <span>✎</span></div><p>${esc(s.history[0]||'¡Bienvenido al laboratorio!')}</p></div></main>
 <section class="right-sidebar panel"><nav class="tabs" aria-label="Secciones de juego">${[['actividades','⚗️','Acciones'],['carrera','🎓','Carrera'],['proyectos','📁','Proyectos'],['legado','🏅','Legado'],['archivo','⚙️','Datos']].map(([key,icon,label])=>`<button class="tab ${tab===key?'active':''}" data-action="tab" data-id="${key}" aria-current="${tab===key?'page':'false'}">${icon}<span>${label}</span></button>`).join('')}</nav><div class="tab-content">${tab==='actividades'?activityPanel():tab==='carrera'?careerPanel():tab==='proyectos'?projectsPanel():tab==='legado'?legacyPanel():archivePanel()}</div></section></div>
 <footer class="footer"><span>© 2026 · Experimento lúdico sin afiliación institucional</span><span>🔒 Tu partida vive en este navegador · Hecho con curiosidad</span></footer></div>${eventModal()}`;
}
/** Vuelve a pintar pantalla desde snapshot ya cargado; no escribe en IndexedDB. */
function render(){if(!root)return;root.innerHTML=(save?(riskOf(save).dropoutAt?dropoutScreen():dashboard()):creation())+(notice?`<div class="toast ${noticeError?'error':''}" role="status">${esc(notice)} <button data-action="dismiss" aria-label="Cerrar aviso">×</button></div>`:'');sceneWalkPending=false;}
/**
 * Envía una orden atómica y sustituye la vista solo con el estado confirmado.
 * Errores de dominio se convierten en aviso visible sin perder la partida.
 */
async function execute(type:Parameters<typeof issueCommand>[1],payload:Record<string,unknown>={}){
 if(!save||busy)return;
 const before=save;busy=true;render();
 try{const {result,save:updated}=await issueCommand(before,type,payload);save=updated;
  if('code' in result){notice=result.message;noticeError=true;showReaction(null);}
  else{
   notice=result.changes.join(' · ')||'Acción registrada';noticeError=false;
   // El reto solamente se cierra cuando el motor confirmó la actividad.
   if(type==='activity.execute' && guidedActivityId===payload.activityId)dismissGuidedActivity();
   if(['career.confirmTransition','career.restartAfterDropout','legacy.startGeneration'].includes(type))dismissGuidedActivity();
   // Reacciones solo tras commit confirmado: jamás en errores o guardados sin cambios.
   showReaction(updated&&!riskOf(updated).dropoutAt?reactionForCommand(type,before,updated):null);
  }
 }catch(error){notice=error instanceof Error?error.message:'Error de almacenamiento';noticeError=true;showReaction(null);}
 finally{busy=false;render();}
}
/**
 * Consulta recuperación al volver al primer plano o cada minuto.
 * Usa el marcador del guardado para no procesar dos veces el mismo intervalo.
 */
async function processOffline(){if(!save||busy||riskOf(save).dropoutAt)return;const marker=save.lastProcessedSimTime;
 if(Date.now()-Date.parse(marker)<60_000)return;
 await execute('time.processOffline',{lastProcessedMarker:marker});
}
// Delegación de eventos: botones dinámicos usan data-action, no listeners individuales.
root.addEventListener('click',async(event)=>{
 const el=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');if(!el||busy)return;
 const action=el.dataset.action,id=el.dataset.id||'';
 switch(action){
 case 'motion':{
  animationsEnabled=!animationsEnabled;
  try{localStorage.setItem(MOTION_KEY,animationsEnabled?'on':'off')}catch{/* Preferencia opcional si el almacenamiento está bloqueado. */}
  render();break;
 }
 case 'tab':tab=id;notice='';dismissGuidedActivity();render();break;
 case 'scene-go':case 'learn':openLearningActivity(id);break;
 case 'learn-answer':{
  if(!guidedActivityId||busy)break;
  const step=learningSequence(guidedActivityId)[guidedStepIndex];
  const answer=Number(id);
  if(!step||!Number.isInteger(answer)||answer<0||answer>2||player().learningProgress?.[guidedActivityId]?.includes(guidedStepIndex))break;
  guidedAnswer=answer;
  if(answer===step.correct){
   // SOLO el motor transaccional guarda el acierto. No concede UPE ni PA.
   await execute('learning.answer',{activityId:guidedActivityId,stepIndex:guidedStepIndex,answer});focusGuidedActivity();
  }else {render();focusGuidedActivity();}
  break;
 }
 case 'learn-next':{
  if(!guidedActivityId||guidedAnswer===null)break;
  const progress=masteredSteps(player().learningProgress,guidedActivityId);
  if(progress<STEP_COUNT){guidedStepIndex=progress;guidedAnswer=null;render();focusGuidedActivity();}
  break;
 }
 case 'learn-close':dismissGuidedActivity();render();break;
 case 'guided-execute':{
  if(!guidedActivityId||guidedActivityId!==id||masteredSteps(player().learningProgress,id)!==STEP_COUNT)break;
  await execute('activity.execute',{activityId:id,practiceMode:'guided'});break;
 }
 case 'activity':{
  if(masteredSteps(player().learningProgress,id)!==STEP_COUNT)break;
  sceneDestination=id;sceneWalkPending=true;
  await execute('activity.execute',{activityId:id,practiceMode:'repeat'});break;
 }
 case 'care':await execute('care.perform',{careActionId:id});break;
 // Solo se envía el ID de rama. El motor valida pertenencia al área y etapa.
 case 'choose-route':await execute('career.chooseRoute',{branchId:id});break;
 // Los intentos incorrectos son gratuitos; solo una respuesta acertada
 // emite un comando persistente, con su premio único por etapa.
 case 'field-answer':{
  const challenge=fieldChallenge(player().areaId,player().stageIndex,player().areaPath);
  const option=Number(id);
  if(option===challenge.correct)await execute('career.completeFieldMission',{answer:option});
  else notify(`🌱 Sigue probando. ${challenge.hint} No pierdes PA.`,true);
  break;
 }
 case 'species':{const area=document.querySelector<HTMLSelectElement>('#species-choice')?.value; if(area)await execute('pet.changeArea',{areaId:area});break;}
 case 'advance':await execute('career.confirmTransition');break;
 case 'submit':await execute('project.submit');break;
 case 'event':await execute('event.resolve',{optionId:id});break;
 case 'auto-on':await execute('automation.activate');break;
 case 'auto-off':await execute('automation.deactivate');break;
 case 'restart':{
  if(confirm('¿Empezar otra oportunidad? Se conservará la generación anterior como récord de deserción ficticia.'))await execute('career.restartAfterDropout');break;
 }
 case 'legacy':{
  const name=(document.querySelector<HTMLInputElement>('#legacy-name')?.value||'').trim();
  if(confirm(`¿Iniciar una nueva generación con ${name||'esta mascota'}? La anterior se conservará como récord.`))await execute('legacy.startGeneration',{newPetName:name});break;
 }
 case 'export':{
  if(!save)return;const contents=exportSave(save);const blob=new Blob([contents],{type:'application/json'});const url=URL.createObjectURL(blob);
  const link=document.createElement('a');link.href=url;link.download=`tama-academico-generacion-${save.generation}.json`;link.click();URL.revokeObjectURL(url);notify('Respaldo JSON descargado.');break;
 }
 case 'dismiss':notice='';render();break;
 }
});
// Creación: valida nombre y área antes de inicializar/reemplazar la partida local.
root.addEventListener('submit',async(event)=>{
 const form=(event.target as HTMLElement).closest<HTMLFormElement>('#create-form');if(!form)return;
 event.preventDefault();if(busy)return;busy=true;
 try{const data=new FormData(form);const name=String(data.get('petName')||'').trim();const area=String(data.get('area')||'biologia');const difficulty=String(data.get('difficulty')||'normal');
  if(!name||name.length>28||!AREAS.some(item=>item[0]===area)||!DIFFICULTIES.some(item=>item.id===difficulty))throw Error('Nombre o área incorrectos.');
  const next=newGame(name,area,difficulty);await initializeSave(next);save=next;dismissGuidedActivity();notice='¡Tu mascota científica ha nacido!';noticeError=false;
 }catch(error){notice=error instanceof Error?error.message:'No se pudo crear la partida.';noticeError=true;}finally{busy=false;render();}
});
// Importación de respaldo con límite 2 MB y confirmación explícita del jugador.
root.addEventListener('change',async(event)=>{
 const input=event.target as HTMLInputElement;if(input.id!=='import-file'||!input.files?.length)return;
 const file=input.files[0];if(file.size>2_000_000){notify('El archivo supera el límite de 2 MB.',true);return;}
 if(!confirm('¿Importar este respaldo? Reemplazará la partida actual en este navegador.')){input.value='';return;}
 busy=true;
 try{const parsed=parseImport(await file.text());await initializeSave(parsed);save=parsed;dismissGuidedActivity();tab='archivo';notice='Respaldo importado correctamente.';noticeError=false;}
 catch(error){notice=error instanceof Error?error.message:'Error al importar.';noticeError=true;}
 finally{busy=false;render();}
});
/** Cierra el reto con Escape; el navegador sigue pudiendo usar sus atajos. */
root.addEventListener('keydown',(event)=>{
 if(event.key==='Escape'&&guidedActivityId){dismissGuidedActivity();render();}
});
/** Carga el guardado y sincroniza tiempo; no migra automáticamente versiones antiguas. */
async function boot(){
 try{save=await getSave();if(save?.schemaVersion!==2){save=null;notice='Esta partida requiere una migración; conserva tu respaldo anterior.';noticeError=true;}render();await processOffline();}
 catch(error){save=null;notice=`No fue posible abrir IndexedDB: ${error instanceof Error?error.message:'error desconocido'}`;noticeError=true;render();}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void processOffline()});
setInterval(()=>{if(!document.hidden)void processOffline()},60_000);
void boot();
