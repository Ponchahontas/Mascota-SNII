/** Datos de balance ficticios: no son disposiciones ni requisitos oficiales del SNII. */
export interface Stage { id: string; label: string; short: string; target: number; maxAP: number; apPerHour: number; cost: number; reward: number; automationSlots: number; emblem: string; }
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

export interface Activity { id:string; label:string; icon:string; minStage:number; pa:number; pe:number; credits:number; energy:number; stress:number; focus:number; motivation?:number; type:string; flavor:string; }
export const ACTIVITIES: readonly Activity[] = [
  {id:'tutoria',label:'Dar una tutoría',icon:'🪙',minStage:0,pa:5,pe:6,credits:4,energy:-4,stress:-1,focus:0,motivation:2,type:'social',flavor:'Compartes conocimientos y ganas créditos para continuar.'},
  {id:'estudiar',label:'Estudiar',icon:'📒',minStage:0,pa:5,pe:8,credits:-2,energy:-4,stress:1,focus:3,type:'estudio',flavor:'Un concepto nuevo; tres preguntas existenciales.'},
  {id:'leer',label:'Leer bibliografía',icon:'📚',minStage:1,pa:4,pe:7,credits:-1,energy:-3,stress:1,focus:2,type:'estudio',flavor:'La bibliografía cita otra bibliografía.'},
  {id:'examen',label:'Preparar examen',icon:'📝',minStage:1,pa:6,pe:10,credits:-2,energy:-5,stress:3,focus:4,type:'estudio',flavor:'El temario acaba de crecer misteriosamente.'},
  {id:'experimentar',label:'Experimentar',icon:'🧪',minStage:3,pa:10,pe:14,credits:-5,energy:-8,stress:4,focus:-2,type:'investigacion',flavor:'¡Control positivo! Ahora falta el presupuesto.'},
  {id:'analizar',label:'Analizar datos',icon:'📊',minStage:4,pa:7,pe:12,credits:-3,energy:-5,stress:2,focus:-3,type:'investigacion',flavor:'Una gráfica bonita no significa causalidad.'},
  {id:'articulo',label:'Escribir artículo',icon:'✍️',minStage:6,pa:9,pe:14,credits:-2,energy:-7,stress:4,focus:-4,type:'escritura',flavor:'Versión final_v7_ahora_sí.docx'},
  {id:'revisar',label:'Revisar manuscrito',icon:'🔍',minStage:6,pa:6,pe:10,credits:-1,energy:-5,stress:3,focus:-2,type:'escritura',flavor:'El revisor dos solicita una luna adicional.'},
  {id:'ensenar',label:'Enseñar',icon:'👩‍🏫',minStage:4,pa:7,pe:10,credits:3,energy:-5,stress:1,focus:0,motivation:3,type:'social',flavor:'Una pregunta del alumnado lo cambia todo.'},
  {id:'colaborar',label:'Colaborar',icon:'🤝',minStage:3,pa:6,pe:9,credits:-2,energy:-4,stress:-1,focus:0,motivation:4,type:'social',flavor:'Una buena idea necesita más de una cabeza.'},
  {id:'divulgar',label:'Divulgar ciencia',icon:'🎙️',minStage:3,pa:5,pe:8,credits:-2,energy:-3,stress:0,focus:0,motivation:4,type:'social',flavor:'Alguien entendió la ciencia sin pagar por el PDF.'},
  {id:'expediente',label:'Tramitar expediente',icon:'🗃️',minStage:4,pa:5,pe:8,credits:-1,energy:-3,stress:2,focus:-1,type:'gestion',flavor:'Falta una firma de quien ya firmó.'},
  {id:'proyecto',label:'Gestionar proyecto',icon:'📋',minStage:4,pa:8,pe:10,credits:-4,energy:-5,stress:3,focus:-2,type:'gestion',flavor:'Se completó el formato para pedir un formato.'},
];
export interface Care { id: string; label: string; icon: string; credits: number; energy?:number; stress?:number; wellbeing?:number; motivation?:number; concentration?:number; socialization?:number; }
export const CARE: readonly Care[] = [
 {id:'comer',label:'Comer',icon:'🥪',credits:-3,energy:8,wellbeing:2,stress:-1},
 {id:'descansar',label:'Descansar',icon:'☕',credits:0,energy:8,stress:-4,concentration:3},
 {id:'dormir',label:'Dormir',icon:'🌙',credits:0,energy:25,stress:-10,concentration:10},
 {id:'socializar',label:'Socializar',icon:'💬',credits:-2,wellbeing:4,motivation:6,stress:-3,socialization:10},
 {id:'recrear',label:'Recreación',icon:'🎮',credits:-1,wellbeing:6,motivation:2,stress:-6},
];
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
