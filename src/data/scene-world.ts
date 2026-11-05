/**
 * @module data/scene-world
 * Escenarios visuales por etapa; ninguna opción modifica reglas del juego.
 * Cada actividad de su etapa ocupa una estación fija del ecosistema.
 * Los cuatro offsets son relativos al centro del sprite y se limitan en CSS
 * para no sacar a la mascota del marco en dispositivos pequeños.
 */
import { activitiesForStage } from './catalog.js';

export interface StageScene { title:string;landscape:string;ambient:string;decoration:readonly [string,string,string]; }
export const STAGE_SCENES: readonly StageScene[]=[
 {title:'Patio de descubrimientos',landscape:'jardin',ambient:'Un aula con colores, cuentos y experimentos seguros.',decoration:['🌳','☀️','🌷']},
 {title:'Escuela de los exploradores',landscape:'aula',ambient:'Libros, números y preguntas sobre el barrio.',decoration:['🏫','📚','🌼']},
 {title:'Club de ciencia escolar',landscape:'aula',ambient:'Las ideas encuentran evidencia en equipo.',decoration:['🔍','📒','🌱']},
 {title:'Taller de prototipos',landscape:'taller',ambient:'Construir, medir y trabajar con seguridad.',decoration:['⚙️','🛠️','📐']},
 {title:'Campus universitario',landscape:'campus',ambient:'Teoría, prácticas y conversaciones.',decoration:['🏛️','🌲','💻']},
 {title:'Centro de prácticas',landscape:'laboratorio',ambient:'Protocolos, supervisión y decisiones responsables.',decoration:['🥼','📋','🧪']},
 {title:'Sala de proyectos de tesis',landscape:'biblioteca',ambient:'Formular preguntas y leer con mirada crítica.',decoration:['📚','💡','📊']},
 {title:'Laboratorio doctoral',landscape:'laboratorio',ambient:'Ensayos, datos y resultados que sorprenden.',decoration:['🧬','🔬','📑']},
 {title:'Red de investigación',landscape:'campus',ambient:'Colaborar y abrir preguntas independientes.',decoration:['🌐','📈','🤝']},
 {title:'Archivo de trayectoria',landscape:'biblioteca',ambient:'Documentar aportes de manera verificable.',decoration:['📁','📚','🔎']},
 {title:'Centro de mentoría',landscape:'campus',ambient:'Coordinar investigaciones y formar personas.',decoration:['🎓','📖','👥']},
 {title:'Red científica colaborativa',landscape:'campus',ambient:'Intercambiar saberes con equipos diversos.',decoration:['🌎','🔗','🎤']},
 {title:'Consorcio científico',landscape:'laboratorio',ambient:'Gobernanza, ciencia abierta y grandes retos.',decoration:['🛰️','🔬','🌐']},
 {title:'Jardín del legado',landscape:'jardin',ambient:'La experiencia se comparte con nuevas generaciones.',decoration:['🌳','📜','🌺']},
];
export const STATION_COUNT=6;
/** La posición es el índice de la actividad dentro de su etapa; nunca se guarda. */
export function stationIndex(stageIndex:number,activityId:string):number {
 return activitiesForStage(stageIndex).findIndex(a=>a.id===activityId);
}
/** El escenario se deriva siempre de la etapa; no hay ventaja estadística por área. */
export function sceneForStage(stageIndex:number):StageScene {return STAGE_SCENES[stageIndex]??STAGE_SCENES[0]}
