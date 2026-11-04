/**
 * @module catalog
 * Parámetros fijos de juego, NO requisitos normativos del SNII.
 * El orden de STAGES es un contrato: stageIndex se guarda en partidas y sprites;
 * mover/eliminar entradas requiere migraciones y cambio de esquema.
 * Para modificar el balance, actualizar pruebas y documentar balanceVersion.
 */
/** Parámetros de economía: `target`=UPE para avanzar y `apPerHour`=recuperación/h. */
export interface Stage { id: string; label: string; short: string; target: number; maxAP: number; apPerHour: number; cost: number; reward: number; automationSlots: number; emblem: string; }
/** Etapas en orden de evolución de 0 (Kínder) a 13 (Emérito). */
export const STAGES: readonly Stage[] = [
  ['kinder','Kínder','Kínder',30,20,4,.55,.35,0,'🧸'],
  ['primaria','Primaria','Primaria',60,24,4,.60,.45,0,'✏️'],
  ['secundaria','Secundaria','Secundaria',100,28,4.5,.65,.55,0,'📚'],
  ['prepa','Preparatoria técnica','Prepa técnica',150,34,4.5,.70,.70,0,'🔬'],
  ['universidad','Universidad','Universidad',220,40,5,.80,.85,1,'🎓'],
  ['especialidad','Especialidad','Especialidad',280,44,5,.85,1,1,'🧪'],
  ['maestria','Maestría','Maestría',360,48,5,.90,1.15,2,'📖'],
  ['doctorado','Doctorado','Doctorado',480,54,5.5,1,1.35,2,'🧬'],
  ['posdoctorado','Posdoctorado','Posdoc',560,58,5.5,1.05,1.55,3,'🧫'],
  ['candidato','Candidato SNII','Candidato',650,62,6,1.10,1.70,3,'📑'],
  ['nivel1','SNII Nivel I','Nivel I',780,68,6,1.15,1.90,4,'🥇'],
  ['nivel2','SNII Nivel II','Nivel II',930,74,6.5,1.25,2.15,5,'🏅'],
  ['nivel3','SNII Nivel III','Nivel III',1100,82,6.5,1.35,2.45,6,'🏆'],
  ['emerito','SNII Emérito','Emérito',1250,90,7,1.4,2.6,6,'🌟'],
].map(([id,label,short,target,maxAP,apPerHour,cost,reward,automationSlots,emblem]) => ({id:id as string,label:label as string,short:short as string,target:target as number,maxAP:maxAP as number,apPerHour:apPerHour as number,cost:cost as number,reward:reward as number,automationSlots:automationSlots as number,emblem:emblem as string}));

/** Actividades ahora están separadas por etapa y no se arrastran a otras edades. */
export { ACTIVITIES, activitiesForStage, STAGE_GUIDES } from './stage-activities.js';
export type { Activity, StageGuide } from './stage-activities.js';
export interface Care { id: string; label: string; icon: string; credits: number; energy?:number; stress?:number; wellbeing?:number; motivation?:number; concentration?:number; socialization?:number; }
/** Cuidados decididos por el jugador; el motor no descuenta PA por cuidarlos. */
export const CARE: readonly Care[] = [
 {id:'comer',label:'Comer',icon:'🥪',credits:-3,energy:8,wellbeing:2,stress:-1},
 {id:'descansar',label:'Descansar',icon:'☕',credits:0,energy:8,stress:-4,concentration:3},
 {id:'dormir',label:'Dormir',icon:'🌙',credits:0,energy:25,stress:-10,concentration:10},
 {id:'socializar',label:'Socializar',icon:'💬',credits:-2,wellbeing:4,motivation:6,stress:-3,socialization:10},
 {id:'recrear',label:'Recreación',icon:'🎮',credits:-1,wellbeing:6,motivation:2,stress:-6},
 // Salvaguarda de balance: no requiere créditos; impide estados sin salida a 0 CR.
 {id:'acompanar',label:'Acompañar',icon:'🤗',credits:0,wellbeing:3,motivation:4,stress:-2,socialization:2},
];
/** Catálogo de áreas visuales: cada ID debe corresponder a PET_KINDS y un SVG. */
export const AREAS = [
 ['fisico','Ciencias físico-matemáticas y de la Tierra','🌌'],
 ['biologia','Biología y Química','🧬'],
 ['medicina','Medicina y Ciencias de la Salud','🩺'],
 ['humanidades','Humanidades y Ciencias de la Conducta','📜'],
 ['sociales','Ciencias Sociales','🌎'],
 ['agro','Biotecnología y Ciencias Agropecuarias','🌱'],
 ['ingenieria','Ingenierías','⚙️'],
] as const;
/** Áreas lúdicas inspiradas en disciplinas de conocimiento; no equivalen a clasificación vigente verificada. */
export const EVENTS = [
 {id:'revision',title:'La revisión interminable',body:'Un comité pide una revisión adicional. ¿Cómo respondes?',options:[{id:'calma',label:'Responder con método',credits:-2,stress:-3,pe:7},{id:'prisa',label:'Responder de inmediato',credits:0,stress:7,pe:12}]},
 {id:'congreso',title:'Invitación inesperada',body:'Te invitan a presentar tu trabajo. ¿Qué decides?',options:[{id:'aceptar',label:'Participar',credits:-4,stress:4,pe:18},{id:'virtual',label:'Compartir en línea',credits:0,stress:-1,pe:8}]},
 {id:'burocracia',title:'El oficio misterioso',body:'Una ventanilla necesita tres copias de algo digital.',options:[{id:'formato',label:'Entregar el formato',credits:-3,stress:2,pe:10},{id:'dialogo',label:'Negociar el trámite',credits:0,stress:-3,pe:5}]},
 {id:'hallazgo',title:'Hallazgo improbable',body:'Tus notas contienen una conexión que nadie esperaba.',options:[{id:'investigar',label:'Seguir la pista',credits:-5,stress:3,pe:20},{id:'compartir',label:'Conversar con el equipo',credits:0,stress:-2,pe:10}]},
] as const;

/** Eventos escolares tempranos que sustituyen burocracia, revistas y congresos para menores. */
export const SCHOOL_EVENTS = [
 {id:'aula',title:'Materiales compartidos',body:'El grupo necesita organizar los colores y cuadernos.',options:[{id:'ayudar',label:'Compartir y ordenar',credits:2,stress:-2,pe:8},{id:'pedir',label:'Pedir ayuda a la persona docente',credits:0,stress:-4,pe:5}]},
 {id:'curiosidad',title:'¡Una pregunta nueva!',body:'La mascota tiene una idea para una tarea o juego de clase.',options:[{id:'explorar',label:'Explorar con acompañamiento',credits:-1,stress:0,pe:12},{id:'equipo',label:'Preguntar al grupo',credits:0,stress:-2,pe:8}]},
 {id:'feria',title:'Feria escolar',body:'Es momento de compartir lo que se aprendió.',options:[{id:'presentar',label:'Presentar su trabajo',credits:3,stress:3,pe:11},{id:'observar',label:'Escuchar y aprender',credits:0,stress:-2,pe:7}]},
] as const;
