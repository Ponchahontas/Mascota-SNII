/**
 * @module engine-health
 * Reglas ficticias de salud académica y dificultad. No modelan diagnósticos
 * clínicos ni representan estadística real de deserción escolar.
 *
 * El tiempo avanza en horas reales con un máximo de 8 h procesadas por visita.
 * La deserción NO ocurre por un medidor bajo de forma aislada: requiere al menos
 * dos necesidades críticas durante un periodo prolongado. En modo tranquilo
 * jamás se fuerza el fin de la partida; los bloqueos temporales sí permanecen.
 *
 * Mantener estas funciones puras permite probar balance sin DOM o IndexedDB.
 */
import type { GameSave, NeedsState, AcademicRisk } from './state.js';
import { applyNeedChanges } from './engine-needs.js';

export type DifficultyId = 'tranquilo'|'normal'|'exigente';
export interface DifficultyRules {
  id:DifficultyId; label:string; description:string;
  decay:number; dropoutHours:number|null;
}
/** El umbral es tiempo en crisis combinada, no tiempo sin abrir la aplicación. */
export const DIFFICULTIES: readonly DifficultyRules[] = [
  {id:'tranquilo',label:'Tranquilo',description:'Necesidades más lentas; sin deserción definitiva.',decay:.65,dropoutHours:null},
  {id:'normal',label:'Equilibrado',description:'Consecuencias graduales y deserción tras 18 h de crisis acumulada.',decay:1,dropoutHours:18},
  {id:'exigente',label:'Exigente',description:'Mayor desgaste y deserción tras 12 h de crisis acumulada.',decay:1.3,dropoutHours:12},
];
/** Partidas de versiones anteriores usaban la dificultad normal. */
export function difficultyOf(id:string):DifficultyRules{return DIFFICULTIES.find(item=>item.id===id)??DIFFICULTIES[1]}
export const emptyRisk=():AcademicRisk=>({criticalHours:0,alerts:0,dropoutAt:null,reason:null});
/** Compatibilidad: v2 carecía de datos de riesgo. NO se reescribe su progreso. */
export function riskOf(save:GameSave):AcademicRisk{return save.risk??emptyRisk()}

export type VitalKey='energy'|'motivation'|'concentration'|'wellbeing'|'stress';
export interface VitalAlert {key:VitalKey; label:string; severity:'precaucion'|'critico'; consequence:string; suggestedCare:string}
const alertInfo:Record<VitalKey,{label:string;low:string;critical:string;care:string}>={
 energy:{label:'Energía',low:'Fatiga: menos UPE por actividad.',critical:'Agotamiento: no puede seguir estudiando hasta descansar.',care:'Dormir'},
 motivation:{label:'Motivación',low:'Desánimo: aprende más lentamente.',critical:'Desmotivación: necesita apoyo para continuar.',care:'Socializar'},
 concentration:{label:'Concentración',low:'Distracción: los avances rinden menos.',critical:'Bloqueo de concentración: necesita una pausa.',care:'Descansar'},
 wellbeing:{label:'Bienestar',low:'Malestar: se ralentiza el progreso académico.',critical:'Desgaste: hay que priorizar cuidados.',care:'Recreación'},
 stress:{label:'Estrés',low:'Presión: disminuye el rendimiento.',critical:'Saturación: no es momento de estudiar.',care:'Dormir o recreación'},
};
/** Estado y consecuencia de los cinco indicadores principales de la pantalla. */
export function vitalAlerts(n:NeedsState):VitalAlert[]{
 const keys:VitalKey[]=['energy','motivation','concentration','wellbeing','stress'];
 return keys.flatMap(key=>{
  const value=n[key],high=key==='stress';
  const severity=high?(value>=90?'critico':value>=70?'precaucion':null):(value<=15?'critico':value<=35?'precaucion':null);
  if(!severity)return [];
  const a=alertInfo[key];
  return [{key,label:a.label,severity,consequence:severity==='critico'?a.critical:a.low,suggestedCare:a.care}];
 });
}
/** Cuenta únicamente estados graves; dos o más forman una crisis combinada. */
export function criticalCount(n:NeedsState):number{
 return Number(n.energy<=15)+Number(n.motivation<=15)+Number(n.concentration<=15)+Number(n.wellbeing<=15)+Number(n.stress>=90);
}
/**
 * Una mascota con un indicador extremo rechaza temporalmente el trabajo.
 * Los cuidados son siempre accesibles y gratuitos en PA para salir del bloqueo.
 */
export function studyBlocker(n:NeedsState):string|null{
 if(n.energy<=5)return 'Agotamiento: antes de estudiar debe dormir o descansar.';
 if(n.motivation<=5)return 'Desmotivación: acompaña a la mascota y mejora su ánimo.';
 if(n.concentration<=5)return 'Bloqueo mental: necesita descansar para recuperar concentración.';
 if(n.wellbeing<=5)return 'Malestar intenso: necesita recreación y cuidados.';
 if(n.stress>=95)return 'Sobrecarga: necesita reducir el estrés antes de trabajar.';
 return null;
}
/** Penalizaciones deterministas, sin aleatoriedad ni errores irreversibles. */
export function performanceFactor(n:NeedsState):number{
 let m=1;
 if(n.energy<=35)m*=n.energy<=15?.52:.78;
 if(n.motivation<=35)m*=n.motivation<=15?.52:.78;
 if(n.concentration<=35)m*=n.concentration<=15?.50:.75;
 if(n.wellbeing<=35)m*=n.wellbeing<=15?.55:.80;
 if(n.stress>=70)m*=n.stress>=90?.48:.78;
 return Math.max(.12,m);
}
/**
 * Metabolismo pasivo con tasas orientativas por hora.
 * Los niveles avanzados sufren desgaste algo mayor; se mantiene el límite
 * de ocho horas por consulta para evitar castigos por ausencias largas.
 */
export function passiveNeedChange(n:NeedsState,hours:number,stageIndex:number,difficultyId:string):NeedsState{
 const h=Math.max(0,Math.min(8,hours));
 const stageMultiplier=.65+.045*Math.max(0,Math.min(13,stageIndex));
 const rate=stageMultiplier*difficultyOf(difficultyId).decay*h;
 const after=applyNeedChanges(n,{energy:-4*rate,motivation:-2*rate,concentration:-3*rate,wellbeing:-1.7*rate,stress:3.4*rate});
 // Efectos cruzados: agotamiento sube presión; mucho estrés reduce concentración.
 const cross:Partial<Record<VitalKey,number>>={};
 if(after.energy<=25)cross.stress=rate;
 if(after.stress>=80)cross.concentration=-rate;
 if(after.wellbeing<=25)cross.motivation=-rate;
 return applyNeedChanges(after,cross);
}
export interface RiskOutcome {risk:AcademicRisk; messages:string[]}
/**
 * Incorpora horas de crisis si existen dos o más medidores críticos.
 * Si se recupera la estabilidad, el riesgo disminuye al doble de velocidad;
 * una acción de cuidado que rompe la combinación quita además una hora.
 * El estado final se fija una sola vez para evitar múltiples registros.
 */
export function advanceAcademicRisk(save:GameSave,hours:number,isoNow:string):RiskOutcome{
 const risk={...riskOf(save)},messages:string[]=[];
 if(risk.dropoutAt)return {risk,messages};
 const h=Math.max(0,Math.min(8,hours));
 const crisis=criticalCount(save.pet.needs)>=2;
 risk.criticalHours=Math.max(0,Math.min(10000,risk.criticalHours+(crisis?h:-2*h)));
 if(risk.criticalHours>=4&&risk.alerts<1){risk.alerts=1;messages.push('⚠️ Riesgo académico: dos o más medidores llevan horas en zona crítica. Prioriza cuidados.');}
 if(risk.criticalHours>=9&&risk.alerts<2){risk.alerts=2;messages.push('🚨 Crisis académica sostenida: recuperar necesidades reduce el riesgo de abandonar.');}
 const limit=difficultyOf(save.difficultyId).dropoutHours;
 if(limit!==null&&risk.criticalHours>=limit){
  risk.dropoutAt=isoNow;
  risk.reason='Deserción por agotamiento y falta prolongada de apoyo; final ficticio de esta generación.';
  messages.push('📕 Esta generación interrumpió sus estudios. Sus récords pueden conservarse en un nuevo comienzo.');
 }
 // Después de estabilizarse, puede aparecer un nuevo aviso en una crisis futura.
 if(risk.criticalHours===0)risk.alerts=0;
 return {risk,messages};
}
/** Es una mejora inmediata modesta, no un atajo para borrar toda una crisis. */
export function easeRiskAfterCare(save:GameSave):AcademicRisk{
 const r={...riskOf(save)};
 if(criticalCount(save.pet.needs)<2&&!r.dropoutAt)r.criticalHours=Math.max(0,r.criticalHours-1);
 if(r.criticalHours===0)r.alerts=0;
 return r;
}
