/** Operación pura de necesidades con límites 0–100. */
import type { NeedsState } from './state.js';
export function applyNeedChanges(current:NeedsState,changes:Partial<Record<keyof NeedsState,number>>):NeedsState{
 const next={...current};
 for(const key of Object.keys(changes) as (keyof NeedsState)[]){
  const change=changes[key];
  if(typeof change!=='number'||!Number.isFinite(change))throw Error(`Necesidad inválida: ${key}`);
  next[key]=Math.max(0,Math.min(100,next[key]+change));
 }
 return next;
}
