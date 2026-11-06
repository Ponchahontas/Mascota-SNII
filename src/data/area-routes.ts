/**
 * @module area-routes
 * Nueve recorridos educativos inspirados en las áreas del SNII de 2026.
 * Las denominaciones oficiales proceden de los Lineamientos DOF de 06/02/2026;
 * los retos, historias, especializaciones, PA y premios son INVENCIONES del juego.
 *
 * CONTRATOS:
 * - areaId reutiliza las siete claves anteriores y añade dos nuevas; no renombrar.
 * - Cada área contiene 14 focos, en el orden exacto de STAGES (0..13).
 * - Elegir una rama desde Universidad cambia el relato y el cierre, no la
 *   elegibilidad ni la normativa real del SNII.
 * - La misión de campo no usa índices de preguntas ya almacenados (0..4).
 */
import { STAGES } from './catalog.js';

export interface AreaBranch { id:string; label:string; goal:string; ending:string; }
export interface AreaRoute {
 id:string; title:string; emblem:string; mentor:string; setting:string; introduction:string;
 themes:readonly string[]; branches:readonly [AreaBranch,AreaBranch];
}
const route=(id:string,title:string,emblem:string,mentor:string,setting:string,introduction:string,themes:readonly string[],branches:readonly [AreaBranch,AreaBranch]):AreaRoute=>({id,title,emblem,mentor,setting,introduction,themes,branches});

/** Temas diferenciados por disciplina Y etapa, con 14 estaciones curriculares. */
export const AREA_ROUTES:Readonly<Record<string,AreaRoute>>={
 fisico:route('fisico','Exploradores del universo','🔭','Una luciérnaga de las preguntas','Observatorio del conocimiento',
  'Descubrir patrones en el cielo, la materia, los números y la Tierra exige observar y comparar evidencia.',
  ['luces y sombras del patio','formas de los minerales','medidas del cielo nocturno','un reloj solar escolar','modelos de movimiento','instrumentos de medición','patrones de sismos','un modelo matemático contrastable','datos de un telescopio compartido','un atlas astronómico abierto','predicción y error de modelos','laboratorios de física coordinados','tecnología de observación pública','memoria de descubrimientos del universo'],
  [{id:'cosmos',label:'Astronomía y universo',goal:'Investigar fenómenos del cosmos con observaciones verificables.',ending:'Un observatorio comunitario conserva su legado astronómico.'},{id:'tierra',label:'Matemáticas y Tierra',goal:'Modelar patrones matemáticos y procesos terrestres con datos.',ending:'Una red de ciencia de la Tierra hereda sus modelos abiertos.'}]),
 biologia:route('biologia','Guardianes de las formas de vida','🧬','Una semilla curiosa','Jardín de descubrimientos',
  'Desde mirar seres vivos hasta comprender moléculas, el conocimiento surge de observar sin dañar.',
  ['hojas y colores de las plantas','insectos del jardín','cadenas alimentarias sencillas','crecimiento de levaduras en simulación','células vistas al microscopio','registro de biodiversidad','comparación de secuencias biológicas','un experimento controlado con plantas','reproducibilidad en un laboratorio','archivo de especímenes no destructivo','conservación genética responsable','red de biología colaborativa','síntesis de hallazgos moleculares','colección abierta de historias de la vida'],
  [{id:'molecular',label:'Biología molecular y química',goal:'Explicar procesos y moléculas con experimentos verificables.',ending:'Una biblioteca de protocolos reproducibles guía nuevas generaciones.'},{id:'ecologia',label:'Ecología y biodiversidad',goal:'Investigar ecosistemas y conservación mediante observación responsable.',ending:'Un jardín de investigación y conservación preserva su legado.'}]),
 medicina:route('medicina','Cuidadores de la salud','🩺','Un búho que escucha','Centro de salud y ciencia',
  'Cuidar implica escuchar, razonar con evidencia y respetar a las personas; el juego nunca sustituye consejos de salud.',
  ['hábitos de higiene cotidianos','emociones y cuidado compartido','alimentos y descanso saludable','prevención y primeros auxilios simulados','salud pública en una comunidad','bioética de un caso ficticio','lectura crítica de estudios clínicos','diseño ético de un estudio de salud','vigilancia de calidad de datos','divulgación de prevención accesible','formación respetuosa de profesionales','evaluación responsable de programas','redes de salud con privacidad','conocimiento médico legado con empatía'],
  [{id:'clinica',label:'Investigación clínica responsable',goal:'Diseñar estudios éticos y comunicar incertidumbre.',ending:'Un centro de formación en investigación clínica conserva sus aprendizajes.'},{id:'publica',label:'Salud pública comunitaria',goal:'Estudiar prevención, equidad y sistemas de salud.',ending:'Una red comunitaria de prevención continúa su obra.'}]),
 conducta:route('conducta','Escuela de la mente y el aprendizaje','🧠','Un colibrí que acompaña','Aula de las emociones',
  'Aprender, sentir y convivir son procesos diferentes entre personas; observarlos exige empatía y cuidado.',
  ['caras que expresan emociones','turnos y cooperación en el juego','estrategias para recordar una historia','formas de aprender en el aula','observación de dinámicas escolares','adaptaciones de aprendizaje inclusivo','análisis de motivación académica','investigación ética de procesos cognitivos','evaluación de programas educativos','formación docente con retroalimentación','acompañamiento respetuoso en el aula','redes de investigación educativa','políticas de inclusión basadas en evidencia','legado de aprendizaje para todas las edades'],
  [{id:'educacion',label:'Investigación educativa',goal:'Probar estrategias de enseñanza inclusiva y su impacto.',ending:'Una escuela-laboratorio inclusiva prolonga sus descubrimientos.'},{id:'conducta',label:'Cognición y comportamiento',goal:'Comprender procesos de aprendizaje y conducta con ética.',ending:'Un centro de investigación de la conducta comparte sus métodos abiertos.'}]),
 humanidades:route('humanidades','Archivo de las historias humanas','📜','Un gato que lee','Biblioteca de las muchas voces',
  'Los textos, lenguas, artes de interpretar y memorias ayudan a comprender sociedades sin reducirlas a un número.',
  ['cuentos de distintas familias','palabras de diferentes lenguas','memorias contadas por mayores','fuentes históricas del barrio','lecturas literarias comparadas','interpretación de archivos culturales','preguntas de historia y filosofía','análisis de discursos y contextos','edición de fuentes con atribución','divulgación de patrimonio cultural','seminario de pensamiento crítico','conservación de archivos colaborativos','diálogo de tradiciones intelectuales','biblioteca pública de memorias humanas'],
  [{id:'historia',label:'Historia y patrimonio',goal:'Investigar fuentes y preservar memorias con consentimiento.',ending:'Un archivo plural resguarda fuentes para las futuras generaciones.'},{id:'filosofia',label:'Filosofía y lenguas',goal:'Estudiar argumentos, traducciones y diversidad lingüística.',ending:'Una escuela de diálogo filosófico mantiene vivo su legado.'}]),
 sociales:route('sociales','Cartógrafos de comunidades','🌎','Una capibara que conversa','Plaza de encuentros',
  'Investigar la vida colectiva requiere escuchar distintas voces y reconocer desigualdades.',
  ['reglas justas para jugar','mapas de la comunidad','tareas de colaboración vecinal','encuestas escolares responsables','economía de una comunidad simulada','participación en decisiones colectivas','diseño de entrevistas respetuosas','estudio de una desigualdad social','análisis crítico de estadísticas públicas','divulgación accesible a comunidades','evaluación de políticas públicas','redes de economía social y solidaria','iniciativa de cooperación territorial','archivo de acuerdos comunitarios'],
  [{id:'politicas',label:'Políticas públicas',goal:'Evaluar decisiones colectivas usando evidencia y participación.',ending:'Un observatorio ciudadano conserva métodos de evaluación pública.'},{id:'economia',label:'Economía social y cooperación',goal:'Investigar redes de apoyo y organización económica solidaria.',ending:'Una red cooperativa conserva el legado de proyectos territoriales.'}]),
 agro:route('agro','Guardianes de los ecosistemas','🌱','Una tortuga que cultiva','Huerto y bosque del conocimiento',
  'La tierra, el agua, los bosques, la producción agropecuaria y la biodiversidad se estudian de forma integrada.',
  ['semillas y suelo del huerto','agua necesaria para una planta','animales y plantas del entorno','composta y huerto escolar','agroecosistemas de una localidad','medición responsable de suelos','diseño de un ensayo agronómico','fenotipado de plantas sin dañarlas','observación de biodiversidad forestal','manejo sustentable de recursos','formación de productores e investigadores','red de monitoreo de ecosistemas','restauración y producción responsable','banco comunitario de semillas y memoria'],
  [{id:'agricultura',label:'Agroecología y producción',goal:'Estudiar producción responsable y manejo de agroecosistemas.',ending:'Un huerto de innovación agroecológica inspira nuevas investigaciones.'},{id:'ecosistemas',label:'Bosques y restauración',goal:'Comprender y restaurar ecosistemas con comunidades.',ending:'Un corredor de restauración ecológica conserva su legado.'}]),
 ingenieria:route('ingenieria','Taller de soluciones responsables','⚙️','Un robot que construye','Laboratorio de prototipos',
  'Diseñar tecnología consiste en entender una necesidad, construir, probar y mejorar de manera segura.',
  ['piezas y construcciones de juguete','puentes de papel resistentes','máquinas simples del aula','prototipos escolares con seguridad','diseño centrado en usuarios','prueba de materiales y dispositivos','análisis de fallas de un prototipo','optimización experimental de un sistema','documentación de tecnología abierta','transferencia responsable simulada','mentoría de equipos de diseño','evaluación de impacto tecnológico','infraestructura accesible y robusta','taller de tecnologías para futuras generaciones'],
  [{id:'software',label:'Software y sistemas',goal:'Construir programas verificables, inclusivos y confiables.',ending:'Un laboratorio abierto de software mantiene herramientas accesibles.'},{id:'materiales',label:'Tecnología y materiales',goal:'Diseñar prototipos, analizar materiales y reducir riesgos.',ending:'Un centro de innovación tecnológica conserva sus diseños probados.'}]),
 interdisciplinaria:route('interdisciplinaria','Puentes entre conocimientos','🧩','Una quimera que integra ideas','Estación de los encuentros',
  'Los problemas complejos requieren escuchar y combinar métodos de varias disciplinas sin borrar sus diferencias.',
  ['formas de explicar un mismo fenómeno','juegos de distintas materias','preguntas que unen ciencias y relatos','proyectos escolares entre talleres','problemas sociales y tecnologías posibles','acuerdos entre especialistas','diseño de investigación entre disciplinas','validación de métodos combinados','datos y experiencias de varias comunidades','comunicación entre campos científicos','formación de equipos con roles claros','evaluación de enfoques múltiples','consorcio de investigación abierta','legado de puentes entre disciplinas'],
  [{id:'socioambiental',label:'Retos socioambientales',goal:'Unir conocimientos sobre ambiente, comunidad y tecnología.',ending:'Un observatorio socioambiental interdisciplinario continúa su labor.'},{id:'tecnohumanista',label:'Tecnología y humanidades',goal:'Combinar ética, sociedad, diseño y tecnología.',ending:'Una escuela de tecnología humana comparte soluciones responsables.'}]),
};

/** Progresión pedagógica común: la temática cambia según área y momento. */
const EDUCATIONAL_METHODS = [
 {verb:'observar y jugar con',purpose:'exploración sensorial',correct:'Observar con cuidado, jugar y contar lo que notamos',wrong:['Decidir sin mirar ni preguntar','Esconder lo que observamos']},
 {verb:'describir y comparar',purpose:'clasificación y expresión',correct:'Comparar ejemplos y explicar sus semejanzas',wrong:['Ignorar las diferencias observadas','Usar solo una adivinanza como prueba']},
 {verb:'preguntar y registrar',purpose:'curiosidad fundamentada',correct:'Hacer preguntas y registrar ejemplos de forma sencilla',wrong:['Copiar sin comprender','Descartar toda pregunta del grupo']},
 {verb:'probar con seguridad',purpose:'proyecto técnico escolar',correct:'Planear una prueba segura y anotar qué sucedió',wrong:['Omitir las reglas de seguridad','Asegurar resultados antes de probar']},
 {verb:'analizar de forma metódica',purpose:'fundamentos universitarios',correct:'Buscar fuentes fiables y distinguir evidencia de opiniones',wrong:['Seleccionar solo fuentes que nos dan la razón','Presentar suposiciones como resultados']},
 {verb:'aplicar y evaluar',purpose:'especialización responsable',correct:'Reconocer límites, supervisión y riesgos del procedimiento',wrong:['Ocultar incertidumbres a colegas','Ignorar el consentimiento necesario']},
 {verb:'delimitar una pregunta',purpose:'planeación de tesis',correct:'Formular una pregunta abordable y justificar el método',wrong:['Proponer una pregunta imposible de comprobar','Elegir la respuesta antes del estudio']},
 {verb:'contrastar hipótesis',purpose:'investigación doctoral',correct:'Usar controles y considerar explicaciones alternativas',wrong:['Eliminar mediciones que contradicen la hipótesis','Afirmar certeza sin replicación']},
 {verb:'reproducir y colaborar',purpose:'investigación posdoctoral',correct:'Documentar métodos y reconocer contribuciones del equipo',wrong:['Omitir condiciones de reproducibilidad','Atribuirse el trabajo ajeno']},
 {verb:'construir un expediente de investigación',purpose:'trayectoria científica',correct:'Documentar aportaciones reales y comunicar límites',wrong:['Inventar productos para aumentar el puntaje','Confundir puntos de juego con dictámenes oficiales']},
 {verb:'orientar nuevas personas',purpose:'mentoría',correct:'Dar retroalimentación respetuosa y verificar evidencias',wrong:['Imponer conclusiones sin diálogo','Negar reconocimiento a colaboradores']},
 {verb:'coordinar una red',purpose:'liderazgo académico',correct:'Acordar responsabilidades y revisar resultados en conjunto',wrong:['Excluir deliberadamente otras perspectivas','Atribuir a un solo grupo todos los logros']},
 {verb:'revisar impacto y ética',purpose:'integridad y responsabilidad',correct:'Examinar beneficios, riesgos y acceso al conocimiento',wrong:['Ignorar a las comunidades afectadas','Priorizar prestigio antes que seguridad']},
 {verb:'preservar y compartir',purpose:'legado científico',correct:'Conservar métodos, historias y aprendizajes para otras generaciones',wrong:['Destruir registros sin evaluación','Ocultar las contribuciones de otros equipos']},
] as const;

export interface FieldChallenge {stageIndex:number;title:string;scene:string;question:string;options:readonly [string,string,string];correct:0|1|2;hint:string;explanation:string;}

/** Una misión original por combinación área x etapa; no modifica los 5 pasos de las aventuras. */
export function fieldChallenge(areaId:string,stageIndex:number,branchId?:string|null):FieldChallenge {
 const entry=AREA_ROUTES[areaId]??AREA_ROUTES.biologia, i=Math.max(0,Math.min(13,Math.trunc(stageIndex)));
 const method=EDUCATIONAL_METHODS[i],theme=entry.themes[i];
 const branch=entry.branches.find(item=>item.id===branchId);
 const starting=[method.correct,...method.wrong];
 // Repartir la posición correcta evita que las respuestas se vuelvan
 // predecibles: rotar sin usar azar conserva la misma clave tras recargar.
 const rotated=(i+Object.keys(AREA_ROUTES).indexOf(entry.id))%3;
 // `correct` es el índice ya rotado, NO el índice de la respuesta
 // original en EDUCATIONAL_METHODS; las pruebas validan las 126 rutas.
 const options: [string,string,string] = [starting[(3-rotated)%3],starting[(4-rotated)%3],starting[(5-rotated)%3]] as [string,string,string];
 return {
  stageIndex:i,title:theme,
  scene:`${entry.emblem} ${entry.setting}: ${theme}. ${branch?`Ruta elegida: ${branch.label}.`:entry.introduction}`,
  question:`¿Cómo puede ${'la mascota'} ${method.verb} «${theme}» de manera responsable?`,
  options,correct:rotated as 0|1|2,
  hint:`Piensa en el propósito de esta etapa: ${method.purpose}. Busca una forma de aprender que permita revisar lo realizado.`,
  explanation:`En ${STAGES[i].label}, la habilidad es ${method.purpose}. «${theme}» permite practicarla con curiosidad, evidencia y respeto; no representa criterios SNII oficiales.`
 };
}

/** Los IDs de rama son permanentes y se guardan; retornar null si cambió el área. */
export function branchOf(areaId:string,branchId:string|undefined|null):AreaBranch|null {
 return AREA_ROUTES[areaId]?.branches.find(branch=>branch.id===branchId)??null;
}

/** Se usa para mostrar objetivos y desenlace simbólico de cada especialización. */
export function areaRouteDescription(areaId:string,stageIndex:number,branchId?:string|null):string {
 const info=AREA_ROUTES[areaId]??AREA_ROUTES.biologia;
 const focus=info.themes[Math.max(0,Math.min(13,Math.trunc(stageIndex)))];
 const branch=branchOf(info.id,branchId);
 return `${info.emblem} ${focus}. ${branch?branch.goal:info.introduction}`;
}

/** Diagnóstico puro útil para validar las 126 combinaciones. */
export function validateAreaRoutes():string[] {
 const errors:string[]=[];
 for(const [id,entry] of Object.entries(AREA_ROUTES)){
  if(entry.themes.length!==STAGES.length)errors.push(`${id}: temas incompletos`);
  if(entry.branches.length!==2||new Set(entry.branches.map(b=>b.id)).size!==2)errors.push(`${id}: ramas incorrectas`);
  for(let i=0;i<STAGES.length;i++){
   const q=fieldChallenge(id,i);
   if(!q.title||!q.scene||new Set(q.options).size!==3||q.options[q.correct]!==EDUCATIONAL_METHODS[i].correct)errors.push(`${id}:${i}: reto inválido`);
  }
 }
 return errors;
}
