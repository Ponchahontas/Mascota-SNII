/** @module engine-needs
 * Operaciones puras sobre necesidades; sin escritura en base de datos.
 * Centraliza el rango 0–100 para que acciones, cuidados y eventos coincidan.
 */
import type { NeedsState } from './state.js';
/**
 * Calcula un objeto nuevo con incrementos/decrementos limitados a 0–100.
 * @param current Valores previos sin mutarlos.
 * @param changes Diferencias por atributo: valores negativos significan desgaste.
 * @returns Necesidades actualizadas.
 * @throws Error para cambios no numéricos, NaN o infinitos.
 */
export function applyNeedChanges(current:NeedsState,changes:Partial<Record<keyof NeedsState,number>>):NeedsState{
 const next={...current};
 for(const key of Object.keys(changes) as (keyof NeedsState)[]){
  const change=changes[key];
  if(typeof change!=='number'||!Number.isFinite(change))throw Error(`Necesidad inválida: ${key}`);
  next[key]=Math.max(0,Math.min(100,next[key]+change));
 }
 return next;
}
