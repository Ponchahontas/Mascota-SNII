/**
 * @module persistence
 * Única puerta de entrada al guardado local en IndexedDB.
 *
 * Hay DOS almacenes en la MISMA transacción `readwrite`:
 * 1) `saves`: snapshot actual bajo la clave `active`.
 * 2) `commands`: huella y resultado de cada comando confirmado.
 *
 * Si la transacción falla, ni el recurso ni su recompensa deben aplicarse.
 * No confundir persistencia local con una cuenta en la nube: hay que exportar JSON.
 */
import type { GameSave } from './state.js';
import type { GameCommand, CommandResult, CommandError } from './commands.js';
import { applyGameAction, type ActionType } from './engine-game.js';
import { AREA_ROUTES, branchOf } from '../data/area-routes.js';
// Mantener este nombre/versionado estable evita perder partidas existentes.
const DB='tamagotchi-academico-v2', SAVE='saves', COMMANDS='commands';
const ACTIVE_KEY='active';
interface SavedCommand { id:string; signature:string; result:CommandResult<null> }
/** Convierte un IDBRequest a Promise; NO reemplaza el `tx.oncomplete` del commit. */
const requestPromise=<T>(req:IDBRequest<T>)=>new Promise<T>((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
/** Abre/crea la base; alterar su estructura requiere una migración de IndexedDB. */
function open():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(SAVE))db.createObjectStore(SAVE);if(!db.objectStoreNames.contains(COMMANDS))db.createObjectStore(COMMANDS,{keyPath:'id'});};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
 });
}
/**
 * Guardia de esquema para importaciones y partidas persistidas.
 * Rechaza valores fuera de rango y tipos inesperados antes de entregarlos al motor.
 *
 * @param x Valor de origen no confiable (JSON o almacenamiento previo).
 * @returns `true` cuando cumple la forma esperada de GameSave v2.
 * NOTA: Validar forma no prueba procedencia ni veracidad científica de los datos.
 */
export function validateSave(x:unknown):x is GameSave {
 if(!x||typeof x!=='object')return false;
 const v=x as Partial<GameSave>;
 if(v.schemaVersion!==2||typeof v.gameId!=='string'||v.gameId.length>128||typeof v.createdAt!=='string'||typeof v.lastProcessedSimTime!=='string')return false;
 const idx=v.stageIndex;
 if(!Number.isInteger(idx)||idx===undefined||idx<0||idx>=14)return false;
 if(!v.pet||typeof v.pet.name!=='string'||v.pet.name.length>28||typeof v.pet.id!=='string'||typeof v.pet.stageId!=='string'||typeof v.pet.appearanceId!=='string')return false;
 const needs=v.pet.needs;
 if(!needs)return false;
 for(const field of ['energy','motivation','concentration','wellbeing','stress','curiosity','competence','socialization','scientificIntegrity'] as const){
  const n=needs[field];if(typeof n!=='number'||!Number.isFinite(n)||n<0||n>100)return false;
 }
 for(const field of ['revision','stageIndex','generation','ap','credits','stageXp','totalXp','evidence','completedProjects','projectProgress','actions','streak','eventCursor'] as const){
  const n=v[field];if(typeof n!=='number'||!Number.isInteger(n)||n<0||n>1_000_000_000)return false;
 }
 if(v.apRegenRemainder!==undefined&&(typeof v.apRegenRemainder!=='number'||!Number.isFinite(v.apRegenRemainder)||v.apRegenRemainder<0||v.apRegenRemainder>=1))return false;
 // `risk` es opcional para que se puedan abrir partidas anteriores al sistema
 // de crisis; el motor lo inicializa al procesar la siguiente orden.
 if(v.risk!==undefined){
  const r=v.risk;
  if(!r||!Number.isFinite(r.criticalHours)||r.criticalHours<0||r.criticalHours>10000||!Number.isInteger(r.alerts)||r.alerts<0||r.alerts>2)return false;
  if(r.dropoutAt!==null&&(typeof r.dropoutAt!=='string'||!Number.isFinite(Date.parse(r.dropoutAt))))return false;
  if(r.reason!==null&&(typeof r.reason!=='string'||r.reason.length>512))return false;
 }

 if(!v.generation||typeof v.areaId!=='string'||typeof v.difficultyId!=='string'||typeof v.projectName!=='string'||typeof v.lastActivity!=='string'||typeof v.automation!=='boolean')return false;
 if(typeof v.contentVersion!=='string'||typeof v.balanceVersion!=='string'||typeof v.normativeVersionId!=='string')return false;
 if(!Array.isArray(v.history)||v.history.length>50||!v.history.every(h=>typeof h==='string'&&h.length<512))return false;
 if(!Array.isArray(v.achievements)||v.achievements.length>150||!v.achievements.every(a=>typeof a==='string'&&a.length<100))return false;
 if(!Array.isArray(v.records)||v.records.length>50||!v.records.every(r=>r&&Number.isInteger(r.generation)&&Number.isFinite(r.score)&&Number.isInteger(r.maxStage)&&r.maxStage>=0&&r.maxStage<14&&typeof r.name==='string'&&(r.outcome===undefined||r.outcome==='legado'||r.outcome==='desercion')))return false;
 // Compatibilidad v0.7: los dos campos son opcionales. Validar la forma si
 // aparecen en JSON importados para bloquear índices o IDs ajenos al catálogo.
 if(v.learningProgress!==undefined){
  if(!v.learningProgress||typeof v.learningProgress!=='object'||Array.isArray(v.learningProgress)||Object.keys(v.learningProgress).length>84)return false;
  for(const [key,steps] of Object.entries(v.learningProgress)){
   if(!/^etapa(?:[0-9]|1[0-3])-[a-z0-9_]+$/.test(key)||!Array.isArray(steps)||steps.length>5||steps.some(i=>!Number.isInteger(i)||i<0||i>4)||new Set(steps).size!==steps.length||steps.some((i,n)=>i!==n))return false;
  }
 }
 if(v.learningRewarded!==undefined&&(!Array.isArray(v.learningRewarded)||v.learningRewarded.length>84||new Set(v.learningRewarded).size!==v.learningRewarded.length||v.learningRewarded.some(key=>typeof key!=='string'||!/^etapa(?:[0-9]|1[0-3])-[a-z0-9_]+$/.test(key))))return false;
 // Los campos de la edición con nueve rutas son opcionales para partidas v0.9.
 // No elevar schemaVersion: los guardados previos deben seguir abriéndose.
 if(typeof v.areaId!=='string'||!Object.hasOwn(AREA_ROUTES,v.areaId))return false;
 if(v.areaPath!==undefined&&(!branchOf(v.areaId,v.areaPath)||v.stageIndex===undefined||v.stageIndex<4))return false;
 if(v.fieldMilestones!==undefined&&(
  !Array.isArray(v.fieldMilestones)||v.fieldMilestones.length>14||
  v.fieldMilestones.some(index=>!Number.isInteger(index)||index<0||index>=14)||
  new Set(v.fieldMilestones).size!==v.fieldMilestones.length
 ))return false;
 if(!v.careTimes||typeof v.careTimes!=='object'||Object.values(v.careTimes).some(t=>typeof t!=='number'||!Number.isFinite(t)))return false;
 if(v.event!==null){
  const e=v.event;if(!e||typeof e.id!=='string'||typeof e.title!=='string'||typeof e.body!=='string'||!Array.isArray(e.options)||e.options.length>5)return false;
  for(const o of e.options){if(typeof o.id!=='string'||typeof o.label!=='string'||!Number.isFinite(o.credits)||!Number.isFinite(o.stress)||!Number.isFinite(o.pe))return false;}
 }
 return true;
}
/** Lee la partida activa o `null` si todavía no se ha creado. */
export async function getSave():Promise<GameSave|null>{const db=await open();try{const tx=db.transaction(SAVE,'readonly');return (await requestPromise(tx.objectStore(SAVE).get(ACTIVE_KEY)) as GameSave|undefined)??null;}finally{db.close()}}
/**
 * Instala una partida nueva o importada.
 * IMPORTANTE: reemplaza la partida activa y limpia la bitácora de IDs previos;
 * la UI debe pedir confirmación antes de invocar esta función al importar.
 */
export async function initializeSave(save:GameSave):Promise<void>{
 if(!validateSave(save))throw Error('La partida no tiene un esquema compatible.');
 const db=await open();try{await new Promise<void>((resolve,reject)=>{
  const tx=db.transaction([SAVE,COMMANDS],'readwrite');
  tx.objectStore(SAVE).put(save,ACTIVE_KEY);
  // Al iniciar/importar una partida, invalidamos IDs de comandos previos.
  tx.objectStore(COMMANDS).clear();tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
 });}finally{db.close()}
}
/** Estructura uniforme de error; solo el conflicto de revisión es reintentable. */
export const failure=(code:string,message:string,currentRevision?:number):CommandError=>({code,message,retryable:code==='STATE_CONFLICT',currentRevision});
/**
 * Aplica exactamente una vez un comando (por ID y payload) dentro de IndexedDB.
 *
 * Pasos que deben mantener este orden:
 * 1. Leer `commands[commandId]`: si coincide la huella, responder `replayed`.
 * 2. Leer snapshot activo y verificar `gameId` + `expectedRevision`.
 * 3. Evaluar el motor puro (puede rechazar sin escribir).
 * 4. Escribir estado NUEVO y resultado en la misma transacción.
 * 5. Resolver solo cuando `tx.oncomplete` confirma durabilidad.
 *
 * @param command Orden inmutable con identidad y revisión esperada.
 * @returns Resultado confirmado/repetido o error tipado.
 * PRECAUCIÓN: introducir `await` dentro de los callbacks IDB puede cerrar
 * la transacción prematuramente; revisar tests de concurrencia al modificar.
 */
export async function commitCommand(command:GameCommand<Record<string,unknown>>):Promise<CommandResult<null>|CommandError>{
 if(!command.commandId||!command.gameId||command.commandSchemaVersion!==1||!Number.isInteger(command.expectedRevision))return failure('INVALID_COMMAND_SCHEMA','El comando no cumple el contrato.');
 const signature=JSON.stringify([command.type,command.gameId,command.payload]);
 const db=await open();
 try {return await new Promise<CommandResult<null>|CommandError>((resolve,reject)=>{
  const tx=db.transaction([SAVE,COMMANDS],'readwrite');
  const saves=tx.objectStore(SAVE),commands=tx.objectStore(COMMANDS);
  let answer:CommandResult<null>|CommandError=failure('PERSISTENCE_ERROR','No se completó la transacción.');
  // La huella incluye tipo, partida y payload: reutilizar un ID con otro
  // contenido se rechaza, en vez de aplicar accidentalmente una nueva acción.
  const lookup=commands.get(command.commandId) as IDBRequest<SavedCommand|undefined>;
  lookup.onsuccess=()=>{
    const prior=lookup.result;
    if(prior){answer=prior.signature===signature?{...prior.result,status:'replayed'}:failure('IDEMPOTENCY_KEY_REUSE','El ID ya se usó con otro contenido.');return;}
    const query=saves.get(ACTIVE_KEY) as IDBRequest<GameSave|undefined>;
    query.onsuccess=()=>{
      const state=query.result;
      if(!state){answer=failure('PERSISTENCE_ERROR','No se encontró la partida.');return;}
      if(state.gameId!==command.gameId){answer=failure('STATE_CONFLICT','La partida activa ha cambiado.',state.revision);return;}
      if(state.revision!==command.expectedRevision){answer=failure('STATE_CONFLICT','Otra pestaña actualizó la partida.',state.revision);return;}
      try {
        const outcome=applyGameAction(state,command.type as ActionType,command.payload);
        outcome.next.revision=state.revision+1;
        answer={status:'committed',commandId:command.commandId,gameId:command.gameId,revisionBefore:state.revision,revisionAfter:outcome.next.revision,changes:outcome.changes,domainEvents:outcome.events,warnings:outcome.warnings,resultData:null};
        saves.put(outcome.next,ACTIVE_KEY);
        commands.put({id:command.commandId,signature,result:answer});
      } catch(error){answer=failure('OPERATION_NOT_ALLOWED',error instanceof Error?error.message:'Acción no válida.');}
    };
  };
  // `oncomplete` es la confirmación de commit; `onsuccess` de un request NO basta.
  tx.oncomplete=()=>resolve(answer);
  tx.onerror=()=>reject(tx.error);
  tx.onabort=()=>reject(tx.error);
 });}finally{db.close()}
}
/**
 * Exportación de respaldo sin acceso al servidor: JSON descargable por la UI.
 * El límite de 2 MB de importación se comprueba en src/ui/app.ts.
 */
export function exportSave(save:GameSave):string{return JSON.stringify({application:'tamagotchi-academico',formatVersion:1,exportedAt:new Date().toISOString(),save},null,2)}
/**
 * Interpreta un respaldo y rechaza archivos fuera del contrato de aplicación.
 * @param text Texto JSON local seleccionado explícitamente por el jugador.
 * @returns Copia de guardado validada; aún NO modifica la base de datos.
 * @throws Error cuando el formato o la partida no son compatibles.
 */
export function parseImport(text:string):GameSave{
 const raw:unknown=JSON.parse(text);
 if(!raw||typeof raw!=='object'||(raw as {application?:string}).application!=='tamagotchi-academico')throw Error('Este archivo no es una exportación del juego.');
 const save=(raw as {save?:unknown}).save;
 if(!validateSave(save))throw Error('El archivo pertenece a otra versión o contiene datos inválidos.');
 // Reabrir un archivo crea sesión nueva; no acepta comandos ocultos ni ejecuta scripts.
 return structuredClone(save);
}
