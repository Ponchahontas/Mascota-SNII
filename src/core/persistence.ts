/** Persistencia en IndexedDB: snapshots y bitácora comparten la misma transacción. */
import type { GameSave } from './state.js';
import type { GameCommand, CommandResult, CommandError } from './commands.js';
import { applyGameAction, type ActionType } from './engine-game.js';
const DB='tamagotchi-academico-v2', SAVE='saves', COMMANDS='commands';
const ACTIVE_KEY='active';
interface SavedCommand { id:string; signature:string; result:CommandResult<null> }
const requestPromise=<T>(req:IDBRequest<T>)=>new Promise<T>((resolve,reject)=>{req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error)});
function open():Promise<IDBDatabase>{
 return new Promise((resolve,reject)=>{
  const req=indexedDB.open(DB,1);
  req.onupgradeneeded=()=>{const db=req.result;if(!db.objectStoreNames.contains(SAVE))db.createObjectStore(SAVE);if(!db.objectStoreNames.contains(COMMANDS))db.createObjectStore(COMMANDS,{keyPath:'id'});};
  req.onsuccess=()=>resolve(req.result);req.onerror=()=>reject(req.error);
 });
}
/** Guardián de importaciones: verifica todos los campos que usa el motor, no solo una muestra. */
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
 if(!v.generation||typeof v.areaId!=='string'||typeof v.difficultyId!=='string'||typeof v.projectName!=='string'||typeof v.lastActivity!=='string'||typeof v.automation!=='boolean')return false;
 if(typeof v.contentVersion!=='string'||typeof v.balanceVersion!=='string'||typeof v.normativeVersionId!=='string')return false;
 if(!Array.isArray(v.history)||v.history.length>50||!v.history.every(h=>typeof h==='string'&&h.length<512))return false;
 if(!Array.isArray(v.achievements)||v.achievements.length>150||!v.achievements.every(a=>typeof a==='string'&&a.length<100))return false;
 if(!Array.isArray(v.records)||v.records.length>50||!v.records.every(r=>r&&Number.isInteger(r.generation)&&Number.isFinite(r.score)&&Number.isInteger(r.maxStage)&&r.maxStage>=0&&r.maxStage<14&&typeof r.name==='string'))return false;
 if(!v.careTimes||typeof v.careTimes!=='object'||Object.values(v.careTimes).some(t=>typeof t!=='number'||!Number.isFinite(t)))return false;
 if(v.event!==null){
  const e=v.event;if(!e||typeof e.id!=='string'||typeof e.title!=='string'||typeof e.body!=='string'||!Array.isArray(e.options)||e.options.length>5)return false;
  for(const o of e.options){if(typeof o.id!=='string'||typeof o.label!=='string'||!Number.isFinite(o.credits)||!Number.isFinite(o.stress)||!Number.isFinite(o.pe))return false;}
 }
 return true;
}
export async function getSave():Promise<GameSave|null>{const db=await open();try{const tx=db.transaction(SAVE,'readonly');return (await requestPromise(tx.objectStore(SAVE).get(ACTIVE_KEY)) as GameSave|undefined)??null;}finally{db.close()}}
export async function initializeSave(save:GameSave):Promise<void>{
 if(!validateSave(save))throw Error('La partida no tiene un esquema compatible.');
 const db=await open();try{await new Promise<void>((resolve,reject)=>{
  const tx=db.transaction([SAVE,COMMANDS],'readwrite');
  tx.objectStore(SAVE).put(save,ACTIVE_KEY);
  // Al iniciar/importar una partida, invalidamos IDs de comandos previos.
  tx.objectStore(COMMANDS).clear();tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);
 });}finally{db.close()}
}
export const failure=(code:string,message:string,currentRevision?:number):CommandError=>({code,message,retryable:code==='STATE_CONFLICT',currentRevision});
/** Ejecución transaccional serializada: evita duplicar recompensas en pestañas concurrentes. */
export async function commitCommand(command:GameCommand<Record<string,unknown>>):Promise<CommandResult<null>|CommandError>{
 if(!command.commandId||!command.gameId||command.commandSchemaVersion!==1||!Number.isInteger(command.expectedRevision))return failure('INVALID_COMMAND_SCHEMA','El comando no cumple el contrato.');
 const signature=JSON.stringify([command.type,command.gameId,command.payload]);
 const db=await open();
 try {return await new Promise<CommandResult<null>|CommandError>((resolve,reject)=>{
  const tx=db.transaction([SAVE,COMMANDS],'readwrite');
  const saves=tx.objectStore(SAVE),commands=tx.objectStore(COMMANDS);
  let answer:CommandResult<null>|CommandError=failure('PERSISTENCE_ERROR','No se completó la transacción.');
  // Primero se consulta la huella: los reintentos no vuelven a ejecutar el motor.
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
  tx.oncomplete=()=>resolve(answer);
  tx.onerror=()=>reject(tx.error);
  tx.onabort=()=>reject(tx.error);
 });}finally{db.close()}
}
/** Exportaciones de datos verificadas antes de importación; tamaño máximo en UI. */
export function exportSave(save:GameSave):string{return JSON.stringify({application:'tamagotchi-academico',formatVersion:1,exportedAt:new Date().toISOString(),save},null,2)}
export function parseImport(text:string):GameSave{
 const raw:unknown=JSON.parse(text);
 if(!raw||typeof raw!=='object'||(raw as {application?:string}).application!=='tamagotchi-academico')throw Error('Este archivo no es una exportación del juego.');
 const save=(raw as {save?:unknown}).save;
 if(!validateSave(save))throw Error('El archivo pertenece a otra versión o contiene datos inválidos.');
 // Reabrir un archivo crea sesión nueva; no acepta comandos ocultos ni ejecuta scripts.
 return structuredClone(save);
}
