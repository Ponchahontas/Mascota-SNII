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
import type { GameSave } from '../core/state.js';
import { newGame, STAGE_GATE } from '../core/engine-game.js';
import { DIFFICULTIES, difficultyOf, riskOf, vitalAlerts, criticalCount, studyBlocker, performanceFactor } from '../core/engine-health.js';
import { issueCommand } from '../core/game-coordinator.js';
import { exportSave, getSave, initializeSave, parseImport } from '../core/persistence.js';
const root=document.querySelector<HTMLElement>('#app');
if(!root)throw Error('Falta #app.');
// Estado de pantalla (NO fuente persistente de verdad); cada comando vuelve a leer IDB.
let save:GameSave|null=null,tab='actividades',notice='',noticeError=false,busy=false;
/** Escapa HTML interpolado para evitar inyectar marcado desde nombres/resguardos JSON. */
const esc=(text:unknown)=>String(text??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]||c));
const fmt=(n:number)=>Math.round(n).toLocaleString('es-MX');
const percent=(value:number,max=100)=>Math.max(0,Math.min(100,value/max*100));
const player=()=>save as GameSave;
const stage=()=>STAGES[player().stageIndex];
const notify=(msg:string,isError=false)=>{notice=msg;noticeError=isError;render()};
const meter=(label:string,value:number,color:string,reverse=false,max=100)=>`<div class="meter"><div class="meter-label"><span>${label}</span><strong>${fmt(value)}${max===100?'%':''}</strong></div><div class="meter-track"><i class="${color} ${reverse?'meter-reverse':''}" style="width:${percent(value,max)}%"></i></div></div>`;
const button=(action:string,id:string,label:string,disabled=false,extra='')=>`<button class="game-btn ${extra}" data-action="${action}" data-id="${esc(id)}" ${disabled?'disabled':''}>${label}</button>`;
const emote=()=>{
 const p=player().pet.needs;
 return p.energy<=15?'agotado':p.stress>=90?'saturado':p.motivation<=15?'desanimado':p.wellbeing<=15?'abatido':p.concentration<=15?'distraído':p.wellbeing>80&&p.stress<35?'feliz':'atento';
};
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
 const s=player(),area=petArea(s.areaId),kind=PET_KINDS[area];
 return `<div class="pet-wrap sprite-wrap" role="img" aria-label="${esc(s.pet.name)}: ${esc(kind.name)}, ${esc(stage().label)}, estado ${esc(emote())}">
  <div class="pixel-orb orb-one"></div><div class="pixel-orb orb-two"></div>
  <div class="pixel-pet pixel-bob" style="background-position:${spriteFrame(s.stageIndex)*100/13}% 0;background-image:url('${petSprite(area)}')"></div>
  <span class="pet-floor"></span><span class="species-label" style="--species-color:${kind.accent}">${kind.icon} ${esc(kind.name)}</span></div>`;
}
/** Formulario de creación; cada área elige una especie pero ninguna ventaja de balance. */
function creation(){
 return `<div class="startup"><div class="startup-art">🎓 <span>✦</span> 🔬</div><div class="startup-card"><div class="eyebrow">★ LABORATORIO DE LO IMPROBABLE · EDICIÓN 0.3</div>
 <h1>Tu carrera científica<br><em>empieza en Kínder.</em></h1><p>Elige la especie de tu futura investigadora o investigador. Cada área tiene una mascota diferente y 14 apariencias que evolucionan con sus aprendizajes.</p>
 <form id="create-form"><label for="pet-name">Nombre de la mascota</label><input id="pet-name" name="petName" maxlength="28" minlength="1" required value="Curiosín" autocomplete="off" />
 <fieldset class="area-fieldset"><legend>Elige un área y una especie</legend><div class="area-gallery">${AREAS.map(([id,label,icon])=>{
  const kind=PET_KINDS[petArea(id)];return `<label class="area-choice"><input type="radio" name="area" value="${id}" ${id==='biologia'?'checked':''} required /><span class="area-card">
   <span class="area-pixel" style="background-image:url('${petSprite(id)}')" aria-hidden="true"></span>
   <strong>${esc(kind.name)}</strong><small>${icon} ${esc(label)}</small><span class="area-traits">${esc(kind.traits)}</span></span></label>`;
 }).join('')}</div></fieldset>
 <fieldset class="difficulty-fieldset"><legend>Elige la dificultad de cuidado</legend><div class="difficulty-gallery">${DIFFICULTIES.map(d=>`<label class="difficulty-choice"><input type="radio" name="difficulty" value="${d.id}" ${d.id==='normal'?'checked':''} required /><span><strong>${esc(d.label)}</strong><small>${esc(d.description)}</small></span></label>`).join('')}</div></fieldset>
 <button type="submit" class="primary huge" ${busy?'disabled':''}>Adoptar mascota científica <span>→</span></button></form>
 <div class="startup-foot">Cada especie tiene sus propias 14 evoluciones · Partida local · Criterios ficticios, no oficiales.</div></div></div>`;
}
/** Lista SOLO acciones de la etapa actual; la mascota actúa, el jugador guía. */
function activityPanel(){
 const s=player(),list=activitiesForStage(s.stageIndex),guide=STAGE_GUIDES[s.stageIndex];
 return `<div class="panel-heading"><div><h2>Aprendizajes de ${esc(stage().short)}</h2><p>La mascota realiza estas actividades${s.stageIndex<4?' con acompañamiento escolar':''}. Tú eliges, supervisas y la cuidas; no das tutorías a otras personas en su lugar.</p></div><span class="tiny-pill">${list.length} actividades</span></div>
 <div class="learning-goal"><strong>🎯 ${esc(guide.goal)}</strong><p>${esc(guide.description)}</p></div>
 ${studyBlocker(s.pet.needs)?`<div class="activity-blocked" role="alert">⛔ ${esc(studyBlocker(s.pet.needs))} Los cuidados siguen disponibles.</div>`:''}<div class="activity-grid">${list.map(a=>{
 const cost=Math.max(1,Math.ceil(a.pa*stage().cost*(s.pet.needs.wellbeing<=25?1.2:1)));
 const unavailable=busy||!!s.event||!!studyBlocker(s.pet.needs)||s.ap<cost||s.credits+a.credits<0;
 return `<button class="activity" data-action="activity" data-id="${esc(a.id)}" ${unavailable?'disabled':''} title="${esc(a.flavor)}"><span class="action-icon">${a.icon}</span><span class="action-body"><strong>${esc(a.label)}</strong><small>${esc(a.flavor)}</small><small>UPE base: ${a.pe} · Créditos: ${a.credits>=0?'+':''}${a.credits}</small></span><span class="cost">${cost} PA</span></button>`;
 }).join('')}</div><p class="muted">UPE = progreso ficticio de etapa. CR = recursos simbólicos de juego; las actividades infantiles no son empleo remunerado.</p>`;
}
/** Presenta requisitos lúdicos de transición; motor los vuelve a validar al confirmar. */
function careerPanel(){
 const s=player(),st=stage(),target=STAGES[s.stageIndex+1];
 const needed=STAGE_GATE(s.stageIndex);const okay=s.stageXp>=st.target&&s.evidence>=needed&&s.pet.needs.competence>=50&&riskOf(s).criticalHours<9;
 return `<div class="panel-heading"><div><h2>Mapa de trayectoria</h2><p>14 etapas de juego; cada etapa requiere UPE y evidencias ficticias.</p></div><span class="tiny-pill">ETAPA ${s.stageIndex+1}/14</span></div>
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
 <div class="species-settings"><h3>🎨 Cambiar especie / área visual</h3><p>Las siete áreas tienen sprites distintos. Puedes probar otro tipo sin perder PA, UPE, etapa ni proyectos; cambia solo su identidad visual y su etiqueta de área.</p><div class="species-controls"><select id="species-choice" aria-label="Área visual de la mascota">${AREAS.map(([key,label])=>`<option value="${key}" ${s.areaId===key?'selected':''}>${esc(PET_KINDS[petArea(key)].name)} · ${esc(label)}</option>`).join('')}</select>${button('species','', 'Cambiar especie',busy)}</div></div>
 <div class="meta"><p><strong>ID de partida:</strong> <code>${esc(s.gameId)}</code></p><p><strong>Revisión:</strong> ${s.revision} · <strong>Esquema:</strong> ${s.schemaVersion} · <strong>Balance:</strong> ${esc(s.balanceVersion)}</p><p><strong>Guardado:</strong> IndexedDB en este dispositivo · <strong>Dificultad:</strong> ${esc(difficultyOf(s.difficultyId).label)}</p><p><strong>Normativa:</strong> Sin validación oficial — mecánica satírica y educativa</p></div>
 <div class="timeline-log"><h3>Últimos movimientos</h3>${s.history.map(h=>`<div class="log-item">${esc(h)}</div>`).join('')}</div>`;
}
function eventModal(){const e=player().event;if(!e)return '';return `<div class="modal-backdrop"><div class="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-title"><span class="eyebrow">⚡ EVENTO IMPROBABLE</span><h2 id="event-title">${esc(e.title)}</h2><p>${esc(e.body)}</p><div class="event-choices">${e.options.map(o=>button('event',o.id,`${esc(o.label)}<small> ${o.credits} CR · ${o.pe} UPE base</small>`,busy)).join('')}</div></div></div>`}
function dashboard(){const s=player(),n=s.pet.needs,st=stage();
 return `<div class="app-frame"><header class="topbar"><div class="brand"><div class="brand-mark">🧪</div><div><span class="eyebrow">ESTACIÓN DE INVESTIGACIÓN 001</span><h1>Tamagotchi <em>Académico</em></h1></div></div><div class="top-right"><span class="online-dot"></span><span class="save-label">Guardado local</span><span class="version-tag">MVP 0.5</span></div></header>
 <div class="notice-banner">UN JUEGO SATÍRICO · Los puntajes y criterios son <strong>ficticios</strong>; no evalúan oficialmente el SNII.</div>
 <div class="workspace"><aside class="left-sidebar"><div class="panel sidebar-top"><div class="panel-title">ESTADO VITAL <span>✦</span></div>
 ${vitalMeter('energy','⚡ Energía','yellow')}${vitalMeter('motivation','💖 Motivación','pink')}${vitalMeter('concentration','🎯 Concentración','purple')}${vitalMeter('wellbeing','🌿 Bienestar','mint')}${vitalMeter('stress','🌡️ Estrés','red')}
 ${healthPanel()}<details class="other-needs"><summary>Otras capacidades ▾</summary>${meter('🔎 Curiosidad',n.curiosity,'purple')}${meter('🧠 Competencia',n.competence,'mint')}${meter('🤝 Socialización',n.socialization,'pink')}${meter('⚖️ Integridad',n.scientificIntegrity,'yellow')}</details></div>
 <div class="panel care-panel"><div class="panel-title">CUIDAR A ${esc(s.pet.name).toUpperCase()}</div><p class="mini-description">El cuidado no consume PA.</p><div class="care-grid">${CARE.map(c=>button('care',c.id,`${c.icon} <span>${esc(c.label)}</span>`,busy,'care-btn')).join('')}</div></div>
 <div class="panel automation-panel"><div class="panel-title">ASISTENTE ACADÉMICO <span>🤖</span></div><p>${s.stageIndex<4?'Disponible a partir de Universidad.':s.automation?'Apoya proyectos durante ausencias. Consume créditos de mantenimiento.':'Actívalo por 35 CR; su producción está limitada.'}</p>${s.stageIndex>=4?button(s.automation?'auto-off':'auto-on','',s.automation?'Desactivar asistente':'Activar asistente (35 CR)',busy):''}</div></aside>
 <main class="center"><div class="pet-scene ${studyBlocker(n)?'scene-crisis':vitalAlerts(n).length?'scene-warning':'scene-good'}"><div class="scene-top"><span class="scene-label">✧ ${esc(PET_KINDS[petArea(s.areaId)].name).toUpperCase()}</span><span class="scene-time">GENERACIÓN ${s.generation}</span></div><div class="scene-decor decor-a">✦</div><div class="scene-decor decor-b">＋</div><div class="scene-decor decor-c">✧</div>${avatar()}
 <div class="pet-caption"><span class="mood-tag">● ${esc(emote())}</span><h2>${esc(s.pet.name)}</h2><p>${st.emblem} ${esc(st.label)} · Evolución ${s.stageIndex+1}/14</p></div></div>
 <div class="resource-cards"><div class="resource-card"><span>⚡ PUNTOS DE ACCIÓN</span><strong>${fmt(s.ap)} <small>/ ${st.maxAP}</small></strong><div class="micro-track"><i style="width:${percent(s.ap,st.maxAP)}%"></i></div><small>${s.ap>=st.maxAP?'PA completos':`+1 PA en aproximadamente ${Math.ceil((1-(s.apRegenRemainder??0))*60/st.apPerHour)} min`}</small></div><div class="resource-card"><span>🪙 CRÉDITOS</span><strong>${fmt(s.credits)}</strong><small>Fondos imaginarios</small></div><div class="resource-card"><span>⭐ UPE DE ETAPA</span><strong>${fmt(s.stageXp)} <small>/ ${fmt(st.target)}</small></strong><div class="micro-track violet"><i style="width:${percent(s.stageXp,st.target)}%"></i></div></div></div>
 <div class="panel stage-progress"><div class="progress-header"><div><span class="eyebrow">PROGRESO DE CARRERA</span><h3>${esc(st.label)} ${s.stageIndex<13?'→ '+esc(STAGES[s.stageIndex+1].short):'· Modo continuo'}</h3></div><span>${fmt(percent(s.stageXp,st.target))}%</span></div><div class="progress-track"><i style="width:${percent(s.stageXp,st.target)}%"></i></div><p>📄 Evidencias: ${s.evidence}/${STAGE_GATE(s.stageIndex)} · 🎯 Competencia: ${fmt(n.competence)}/50 · 🔁 Racha: ${s.streak+1} · ⚙️ Rendimiento vital: ${Math.round(performanceFactor(n)*100)} %</p></div>
 <div class="panel mini-log"><div class="panel-title">ÚLTIMA NOTA DE LABORATORIO <span>✎</span></div><p>${esc(s.history[0]||'¡Bienvenido al laboratorio!')}</p></div></main>
 <section class="right-sidebar panel"><nav class="tabs" aria-label="Secciones de juego">${[['actividades','⚗️','Acciones'],['carrera','🎓','Carrera'],['proyectos','📁','Proyectos'],['legado','🏅','Legado'],['archivo','⚙️','Datos']].map(([key,icon,label])=>`<button class="tab ${tab===key?'active':''}" data-action="tab" data-id="${key}" aria-current="${tab===key?'page':'false'}">${icon}<span>${label}</span></button>`).join('')}</nav><div class="tab-content">${tab==='actividades'?activityPanel():tab==='carrera'?careerPanel():tab==='proyectos'?projectsPanel():tab==='legado'?legacyPanel():archivePanel()}</div></section></div>
 <footer class="footer"><span>© 2026 · Experimento lúdico sin afiliación institucional</span><span>🔒 Tu partida vive en este navegador · Hecho con curiosidad</span></footer></div>${eventModal()}`;
}
/** Vuelve a pintar pantalla desde snapshot ya cargado; no escribe en IndexedDB. */
function render(){if(!root)return;root.innerHTML=(save?(riskOf(save).dropoutAt?dropoutScreen():dashboard()):creation())+(notice?`<div class="toast ${noticeError?'error':''}" role="status">${esc(notice)} <button data-action="dismiss" aria-label="Cerrar aviso">×</button></div>`:'');}
/**
 * Envía una orden atómica y sustituye la vista solo con el estado confirmado.
 * Errores de dominio se convierten en aviso visible sin perder la partida.
 */
async function execute(type:Parameters<typeof issueCommand>[1],payload:Record<string,unknown>={}){
 if(!save||busy)return;busy=true;render();
 try{const {result,save:updated}=await issueCommand(save,type,payload);save=updated;
  if('code' in result){notice=result.message;noticeError=true;}else{notice=result.changes.join(' · ')||'Acción registrada';noticeError=false;}
 }catch(error){notice=error instanceof Error?error.message:'Error de almacenamiento';noticeError=true;}finally{busy=false;render();}
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
 case 'tab':tab=id;notice='';render();break;
 case 'activity':await execute('activity.execute',{activityId:id});break;
 case 'care':await execute('care.perform',{careActionId:id});break;
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
  const next=newGame(name,area,difficulty);await initializeSave(next);save=next;notice='¡Tu mascota científica ha nacido!';noticeError=false;
 }catch(error){notice=error instanceof Error?error.message:'No se pudo crear la partida.';noticeError=true;}finally{busy=false;render();}
});
// Importación de respaldo con límite 2 MB y confirmación explícita del jugador.
root.addEventListener('change',async(event)=>{
 const input=event.target as HTMLInputElement;if(input.id!=='import-file'||!input.files?.length)return;
 const file=input.files[0];if(file.size>2_000_000){notify('El archivo supera el límite de 2 MB.',true);return;}
 if(!confirm('¿Importar este respaldo? Reemplazará la partida actual en este navegador.')){input.value='';return;}
 busy=true;
 try{const parsed=parseImport(await file.text());await initializeSave(parsed);save=parsed;tab='archivo';notice='Respaldo importado correctamente.';noticeError=false;}
 catch(error){notice=error instanceof Error?error.message:'Error al importar.';noticeError=true;}
 finally{busy=false;render();}
});
/** Carga el guardado y sincroniza tiempo; no migra automáticamente versiones antiguas. */
async function boot(){
 try{save=await getSave();if(save?.schemaVersion!==2){save=null;notice='Esta partida requiere una migración; conserva tu respaldo anterior.';noticeError=true;}render();await processOffline();}
 catch(error){save=null;notice=`No fue posible abrir IndexedDB: ${error instanceof Error?error.message:'error desconocido'}`;noticeError=true;render();}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void processOffline()});
setInterval(()=>{if(!document.hidden)void processOffline()},60_000);
void boot();
