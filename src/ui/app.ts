/** Interfaz accesible: únicamente emite comandos; nunca altera recursos directamente. */
import { STAGES, ACTIVITIES, CARE, AREAS } from '../data/catalog.js';
import type { GameSave } from '../core/state.js';
import { newGame, STAGE_GATE } from '../core/engine-game.js';
import { issueCommand } from '../core/game-coordinator.js';
import { exportSave, getSave, initializeSave, parseImport } from '../core/persistence.js';
const root=document.querySelector<HTMLElement>('#app');
if(!root)throw Error('Falta #app.');
let save:GameSave|null=null,tab='actividades',notice='',noticeError=false,busy=false;
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
 return p.energy<20?'agotado':p.stress>75?'estresado':p.wellbeing>80?'feliz':'atento';
};
function avatar(){
 const area=AREAS.find(([id])=>id===player().areaId);
 const color=player().stageIndex>=9?'senior':player().stageIndex>=4?'graduate':'junior';
 const mood=emote();
 return `<div class="pet-wrap ${color}" role="img" aria-label="Mascota pixel art ${esc(player().pet.name)}, ${esc(mood)}">
  <div class="pixel-orb orb-one"></div><div class="pixel-orb orb-two"></div>
  <div class="pet pixel-bob"><div class="pet-cap"></div><div class="pet-ear left"></div><div class="pet-ear right"></div>
  <div class="pet-head"><span class="pet-blush left"></span><span class="pet-eye left"></span><span class="pet-eye right"></span><span class="pet-mouth ${mood}"></span><span class="pet-blush right"></span></div>
  <div class="pet-body"><span class="pet-badge">${area?area[2]:'★'}</span></div><div class="pet-foot left"></div><div class="pet-foot right"></div></div>
  <span class="pet-floor"></span></div>`;
}
function creation(){
 return `<div class="startup"><div class="startup-art">🎓 <span>✦</span> 🔬</div><div class="startup-card"><div class="eyebrow">★ LABORATORIO DE LO IMPROBABLE · EDICIÓN 0.2</div>
 <h1>Tu carrera científica<br><em>empieza en Kínder.</em></h1><p>Cuida una pequeña mente curiosa, completa proyectos, sobrevive a los trámites y llega hasta el reconocimiento emérito. Sin prisa, sin final obligatorio.</p>
 <form id="create-form"><label for="pet-name">Nombre de la mascota</label><input id="pet-name" name="petName" maxlength="28" minlength="1" required value="Curiosín" autocomplete="off" />
 <label for="pet-area">Área del conocimiento (temática ilustrativa)</label><select name="area" id="pet-area">${AREAS.map(([id,label,icon])=>`<option value="${id}">${icon} ${esc(label)}</option>`).join('')}</select>
 <button type="submit" class="primary huge" ${busy?'disabled':''}>Iniciar aventura <span>→</span></button></form>
 <div class="startup-foot">Partida local en tu navegador · No requiere registro · Datos y criterios del juego ficticios.</div></div></div>`;
}
function activityPanel(){
 const s=player();return `<div class="panel-heading"><div><h2>Acciones académicas</h2><p>Cambia entre actividades para encadenar bonificaciones. Cada acción gasta PA.</p></div><span class="tiny-pill">${ACTIVITIES.filter(a=>a.minStage<=s.stageIndex).length} disponibles</span></div>
 <div class="activity-grid">${ACTIVITIES.map(a=>{
 const locked=a.minStage>s.stageIndex;const cost=Math.max(1,Math.ceil(a.pa*stage().cost));
 return `<button class="activity ${locked?'locked':''}" data-action="activity" data-id="${a.id}" ${locked||busy||!!s.event?'disabled':''} title="${esc(a.flavor)}"><span class="action-icon">${a.icon}</span><span class="action-body"><strong>${esc(a.label)}</strong><small>${locked?'Se desbloquea en '+esc(STAGES[a.minStage].short):esc(a.flavor)}</small></span><span class="cost">${locked?'🔒':cost+' PA'}</span></button>`;
 }).join('')}</div>`;
}
function careerPanel(){
 const s=player(),st=stage(),target=STAGES[s.stageIndex+1];
 const needed=STAGE_GATE(s.stageIndex);const okay=s.stageXp>=st.target&&s.evidence>=needed&&s.pet.needs.competence>=50;
 return `<div class="panel-heading"><div><h2>Mapa de trayectoria</h2><p>14 etapas de juego; cada etapa requiere UPE y evidencias ficticias.</p></div><span class="tiny-pill">ETAPA ${s.stageIndex+1}/14</span></div>
 <div class="timeline">${STAGES.map((item,i)=>`<div class="stage-node ${i===s.stageIndex?'current':i<s.stageIndex?'done':''}"><span class="stage-icon">${item.emblem}</span><div><strong>${esc(item.label)}</strong><small>${i===s.stageIndex?'Etapa actual':i<s.stageIndex?'Completada':'Por desbloquear'} · ${fmt(item.target)} UPE</small></div><span class="stage-status">${i===s.stageIndex?'●':i<s.stageIndex?'✓':'○'}</span></div>`).join('')}</div>
 <div class="transition"><h3>${target?`Siguiente etapa: ${esc(target.label)}`:'¡Alcanzaste Emérito!'}</h3><p>Progreso ${fmt(s.stageXp)} / ${fmt(st.target)} UPE · Evidencias ${s.evidence} / ${needed} · Competencia ${fmt(s.pet.needs.competence)} / 50</p>
 ${target?button('advance','', '🎓 Solicitar avance de etapa',!okay||busy,'primary'): '<p>Puedes continuar acumulando progreso o elegir iniciar una nueva generación en Legado.</p>'}</div>`;
}
function projectsPanel(){
 const s=player();return `<div class="panel-heading"><div><h2>Bitácora de proyectos</h2><p>Las actividades nutren tu proyecto. Entregarlo genera evidencias, no reconocimientos oficiales.</p></div></div>
 <div class="project-card"><div class="project-art">📁<span> ✧</span></div><div class="project-info"><span class="eyebrow">PROYECTO EN CURSO</span><h3>${esc(s.projectName)}</h3><p>Avanza investigando, estudiando y colaborando.</p>${meter('Avance del proyecto',s.projectProgress,'mint')}${button('submit','',s.projectProgress>=100?'✓ Entregar proyecto (+2 evidencias y 12 CR)':'Completa el proyecto para entregar',s.projectProgress<100||busy,'primary')}</div></div>
 <div class="stat-grid"><div class="small-stat"><span>📄 Evidencias</span><strong>${s.evidence}</strong></div><div class="small-stat"><span>✅ Proyectos cerrados</span><strong>${s.completedProjects}</strong></div><div class="small-stat"><span>🎯 Acciones</span><strong>${s.actions}</strong></div></div>`;
}
function legacyPanel(){
 const s=player();return `<div class="panel-heading"><div><h2>Legado y expedientes</h2><p>No existe final obligatorio. Tus récords pueden continuar generación tras generación.</p></div></div>
 <div class="legacy-hero"><div class="legacy-icon">🏛️</div><div><span class="eyebrow">ARCHIVO HISTÓRICO</span><h3>Generación ${s.generation}</h3><p>${esc(s.pet.name)} · ${esc(stage().label)} · ${fmt(s.totalXp)} UPE históricos</p></div></div>
 <div class="achievements"><h3>🏅 Logros (${s.achievements.length})</h3><div class="pill-row">${s.achievements.length?s.achievements.map(a=>`<span class="achievement">✦ ${esc(a.replaceAll('-',' '))}</span>`).join(''):'<span class="muted">Los logros llegarán con tus primeras aventuras.</span>'}</div></div>
 <div class="record-list"><h3>Récords anteriores</h3>${s.records.length?s.records.slice().reverse().map(r=>`<div class="record"><strong>Generación ${r.generation} — ${esc(r.name)}</strong><span>${fmt(r.score)} UPE · ${esc(STAGES[r.maxStage]?.short||'—')}</span></div>`).join(''):'<p class="muted">Todavía no hay generaciones anteriores.</p>'}</div>
 <div class="legacy-action"><p>Desbloqueas un nuevo comienzo al llegar a Candidato SNII. Es opcional; tu partida no termina sola.</p><label for="legacy-name">Nombre de la siguiente generación</label><div class="inline-form"><input id="legacy-name" maxlength="28" value="Nueva curiosidad" />${button('legacy','', '🌱 Iniciar legado',s.stageIndex<9||busy,'primary')}</div></div>`;
}
function archivePanel(){
 const s=player();return `<div class="panel-heading"><div><h2>Tu expediente personal</h2><p>Datos locales: controla tus copias. No hay cuenta ni sincronización en la nube.</p></div></div>
 <div class="archive-actions"><div><h3>📥 Exportar partida</h3><p>Guarda un archivo JSON para respaldar tu trayectoria.</p>${button('export','', 'Descargar respaldo',busy)}</div><div><h3>📤 Importar partida</h3><p>Reemplaza la partida actual después de confirmar. Compatible con formato v2.</p><label for="import-file" class="file-label">Elegir JSON…</label><input type="file" id="import-file" accept=".json,application/json" /></div></div>
 <div class="meta"><p><strong>ID de partida:</strong> <code>${esc(s.gameId)}</code></p><p><strong>Revisión:</strong> ${s.revision} · <strong>Esquema:</strong> ${s.schemaVersion} · <strong>Balance:</strong> ${esc(s.balanceVersion)}</p><p><strong>Guardado:</strong> IndexedDB en este dispositivo</p><p><strong>Normativa:</strong> Sin validación oficial — mecánica satírica y educativa</p></div>
 <div class="timeline-log"><h3>Últimos movimientos</h3>${s.history.map(h=>`<div class="log-item">${esc(h)}</div>`).join('')}</div>`;
}
function eventModal(){const e=player().event;if(!e)return '';return `<div class="modal-backdrop"><div class="event-modal" role="dialog" aria-modal="true" aria-labelledby="event-title"><span class="eyebrow">⚡ EVENTO IMPROBABLE</span><h2 id="event-title">${esc(e.title)}</h2><p>${esc(e.body)}</p><div class="event-choices">${e.options.map(o=>button('event',o.id,`${esc(o.label)}<small> ${o.credits} CR · ${o.pe} UPE base</small>`,busy)).join('')}</div></div></div>`}
function dashboard(){const s=player(),n=s.pet.needs,st=stage();
 return `<div class="app-frame"><header class="topbar"><div class="brand"><div class="brand-mark">🧪</div><div><span class="eyebrow">ESTACIÓN DE INVESTIGACIÓN 001</span><h1>Tamagotchi <em>Académico</em></h1></div></div><div class="top-right"><span class="online-dot"></span><span class="save-label">Guardado local</span><span class="version-tag">MVP 0.2</span></div></header>
 <div class="notice-banner">UN JUEGO SATÍRICO · Los puntajes y criterios son <strong>ficticios</strong>; no evalúan oficialmente el SNII.</div>
 <div class="workspace"><aside class="left-sidebar"><div class="panel sidebar-top"><div class="panel-title">ESTADO VITAL <span>✦</span></div>
 ${meter('⚡ Energía',n.energy,'yellow')}${meter('💖 Motivación',n.motivation,'pink')}${meter('🎯 Concentración',n.concentration,'purple')}${meter('🌿 Bienestar',n.wellbeing,'mint')}${meter('🌡️ Estrés',n.stress,'red',true)}
 <details class="other-needs"><summary>Otras capacidades ▾</summary>${meter('🔎 Curiosidad',n.curiosity,'purple')}${meter('🧠 Competencia',n.competence,'mint')}${meter('🤝 Socialización',n.socialization,'pink')}${meter('⚖️ Integridad',n.scientificIntegrity,'yellow')}</details></div>
 <div class="panel care-panel"><div class="panel-title">CUIDAR A ${esc(s.pet.name).toUpperCase()}</div><p class="mini-description">El cuidado no consume PA.</p><div class="care-grid">${CARE.map(c=>button('care',c.id,`${c.icon} <span>${esc(c.label)}</span>`,busy,'care-btn')).join('')}</div></div>
 <div class="panel automation-panel"><div class="panel-title">ASISTENTE ACADÉMICO <span>🤖</span></div><p>${s.stageIndex<4?'Disponible a partir de Universidad.':s.automation?'Apoya proyectos durante ausencias. Consume créditos de mantenimiento.':'Actívalo por 35 CR; su producción está limitada.'}</p>${s.stageIndex>=4?button(s.automation?'auto-off':'auto-on','',s.automation?'Desactivar asistente':'Activar asistente (35 CR)',busy):''}</div></aside>
 <main class="center"><div class="pet-scene"><div class="scene-top"><span class="scene-label">✧ LABORATORIO DE LO IMPROBABLE</span><span class="scene-time">GENERACIÓN ${s.generation}</span></div><div class="scene-decor decor-a">✦</div><div class="scene-decor decor-b">＋</div><div class="scene-decor decor-c">✧</div>${avatar()}
 <div class="pet-caption"><span class="mood-tag">● ${esc(emote())}</span><h2>${esc(s.pet.name)}</h2><p>${st.emblem} ${esc(st.label)}</p></div></div>
 <div class="resource-cards"><div class="resource-card"><span>⚡ PUNTOS DE ACCIÓN</span><strong>${fmt(s.ap)} <small>/ ${st.maxAP}</small></strong><div class="micro-track"><i style="width:${percent(s.ap,st.maxAP)}%"></i></div></div><div class="resource-card"><span>🪙 CRÉDITOS</span><strong>${fmt(s.credits)}</strong><small>Fondos imaginarios</small></div><div class="resource-card"><span>⭐ UPE DE ETAPA</span><strong>${fmt(s.stageXp)} <small>/ ${fmt(st.target)}</small></strong><div class="micro-track violet"><i style="width:${percent(s.stageXp,st.target)}%"></i></div></div></div>
 <div class="panel stage-progress"><div class="progress-header"><div><span class="eyebrow">PROGRESO DE CARRERA</span><h3>${esc(st.label)} ${s.stageIndex<13?'→ '+esc(STAGES[s.stageIndex+1].short):'· Modo continuo'}</h3></div><span>${fmt(percent(s.stageXp,st.target))}%</span></div><div class="progress-track"><i style="width:${percent(s.stageXp,st.target)}%"></i></div><p>📄 Evidencias: ${s.evidence}/${STAGE_GATE(s.stageIndex)} · 🎯 Competencia: ${fmt(n.competence)}/50 · 🔁 Racha: ${s.streak+1}</p></div>
 <div class="panel mini-log"><div class="panel-title">ÚLTIMA NOTA DE LABORATORIO <span>✎</span></div><p>${esc(s.history[0]||'¡Bienvenido al laboratorio!')}</p></div></main>
 <section class="right-sidebar panel"><nav class="tabs" aria-label="Secciones de juego">${[['actividades','⚗️','Acciones'],['carrera','🎓','Carrera'],['proyectos','📁','Proyectos'],['legado','🏅','Legado'],['archivo','⚙️','Datos']].map(([key,icon,label])=>`<button class="tab ${tab===key?'active':''}" data-action="tab" data-id="${key}" aria-current="${tab===key?'page':'false'}">${icon}<span>${label}</span></button>`).join('')}</nav><div class="tab-content">${tab==='actividades'?activityPanel():tab==='carrera'?careerPanel():tab==='proyectos'?projectsPanel():tab==='legado'?legacyPanel():archivePanel()}</div></section></div>
 <footer class="footer"><span>© 2026 · Experimento lúdico sin afiliación institucional</span><span>🔒 Tu partida vive en este navegador · Hecho con curiosidad</span></footer></div>${eventModal()}`;
}
function render(){if(!root)return;root.innerHTML=(save?dashboard():creation())+(notice?`<div class="toast ${noticeError?'error':''}" role="status">${esc(notice)} <button data-action="dismiss" aria-label="Cerrar aviso">×</button></div>`:'');}
async function execute(type:Parameters<typeof issueCommand>[1],payload:Record<string,unknown>={}){
 if(!save||busy)return;busy=true;render();
 try{const {result,save:updated}=await issueCommand(save,type,payload);save=updated;
  if('code' in result){notice=result.message;noticeError=true;}else{notice=result.changes.join(' · ')||'Acción registrada';noticeError=false;}
 }catch(error){notice=error instanceof Error?error.message:'Error de almacenamiento';noticeError=true;}finally{busy=false;render();}
}
async function processOffline(){if(!save||busy)return;const marker=save.lastProcessedSimTime;
 if(Date.now()-Date.parse(marker)<60_000)return;
 await execute('time.processOffline',{lastProcessedMarker:marker});
}
root.addEventListener('click',async(event)=>{
 const el=(event.target as HTMLElement).closest<HTMLButtonElement>('[data-action]');if(!el||busy)return;
 const action=el.dataset.action,id=el.dataset.id||'';
 switch(action){
 case 'tab':tab=id;notice='';render();break;
 case 'activity':await execute('activity.execute',{activityId:id});break;
 case 'care':await execute('care.perform',{careActionId:id});break;
 case 'advance':await execute('career.confirmTransition');break;
 case 'submit':await execute('project.submit');break;
 case 'event':await execute('event.resolve',{optionId:id});break;
 case 'auto-on':await execute('automation.activate');break;
 case 'auto-off':await execute('automation.deactivate');break;
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
root.addEventListener('submit',async(event)=>{
 const form=(event.target as HTMLElement).closest<HTMLFormElement>('#create-form');if(!form)return;
 event.preventDefault();if(busy)return;busy=true;
 try{const data=new FormData(form);const name=String(data.get('petName')||'').trim();const area=String(data.get('area')||'biologia');
  if(!name||name.length>28||!AREAS.some(item=>item[0]===area))throw Error('Nombre o área incorrectos.');
  const next=newGame(name,area);await initializeSave(next);save=next;notice='¡Tu mascota científica ha nacido!';noticeError=false;
 }catch(error){notice=error instanceof Error?error.message:'No se pudo crear la partida.';noticeError=true;}finally{busy=false;render();}
});
root.addEventListener('change',async(event)=>{
 const input=event.target as HTMLInputElement;if(input.id!=='import-file'||!input.files?.length)return;
 const file=input.files[0];if(file.size>2_000_000){notify('El archivo supera el límite de 2 MB.',true);return;}
 if(!confirm('¿Importar este respaldo? Reemplazará la partida actual en este navegador.')){input.value='';return;}
 busy=true;
 try{const parsed=parseImport(await file.text());await initializeSave(parsed);save=parsed;tab='archivo';notice='Respaldo importado correctamente.';noticeError=false;}
 catch(error){notice=error instanceof Error?error.message:'Error al importar.';noticeError=true;}
 finally{busy=false;render();}
});
async function boot(){
 try{save=await getSave();if(save?.schemaVersion!==2){save=null;notice='Esta partida requiere una migración; conserva tu respaldo anterior.';noticeError=true;}render();await processOffline();}
 catch(error){save=null;notice=`No fue posible abrir IndexedDB: ${error instanceof Error?error.message:'error desconocido'}`;noticeError=true;render();}
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)void processOffline()});
setInterval(()=>{if(!document.hidden)void processOffline()},60_000);
void boot();
