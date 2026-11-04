/** Actividades lúdicas por etapa. Nunca deben interpretarse como criterios oficiales de evaluación del SNII. */
export interface StageGuide { goal:string; project:string; description:string; }
export const STAGE_GUIDES: readonly StageGuide[] = [
  {goal:"Explorar jugando",project:"Mi cuaderno de descubrimientos",description:"La mascota reconoce formas, colores y convivencia mediante juegos guiados."},
  {goal:"Aprender los fundamentos",project:"Feria de aprendizajes de primaria",description:"La mascota practica lectura, matemáticas y observación de su entorno."},
  {goal:"Investigar en la escuela",project:"Proyecto escolar interdisciplinario",description:"La mascota aprende a observar, argumentar y presentar resultados sencillos."},
  {goal:"Desarrollar habilidades técnicas",project:"Prototipo y bitácora técnica",description:"La mascota sigue protocolos, documenta prácticas y muestra habilidades técnicas."},
  {goal:"Integrar conocimientos universitarios",project:"Proyecto integrador universitario",description:"La mascota aplica fundamentos disciplinarios en un proyecto guiado."},
  {goal:"Ejercer práctica especializada",project:"Caso de especialidad con supervisión",description:"La mascota resuelve problemas de su campo con responsabilidad profesional."},
  {goal:"Construir una investigación de maestría",project:"Diseño y avance de tesis de maestría",description:"La mascota formula preguntas, analiza evidencia y comunica su investigación."},
  {goal:"Producir conocimiento original",project:"Investigación y tesis doctoral",description:"La mascota diseña, ejecuta y defiende una contribución original."},
  {goal:"Consolidar autonomía científica",project:"Nueva línea de investigación posdoctoral",description:"La mascota impulsa estudios propios y colabora con otros grupos."},
  {goal:"Demostrar trayectoria inicial",project:"Expediente de investigación inicial",description:"La mascota documenta investigación, docencia y vinculación de forma ficticia."},
  {goal:"Sostener producción y formación",project:"Proyecto con estudiantes y comunidad",description:"La mascota combina resultados, mentoría y responsabilidad social."},
  {goal:"Liderar investigación colaborativa",project:"Red de investigación consolidada",description:"La mascota coordina equipos, redes y formación avanzada."},
  {goal:"Impulsar ciencia de alto impacto",project:"Consorcio científico colaborativo",description:"La mascota promueve proyectos estratégicos, ética y conocimiento abierto."},
  {goal:"Compartir un legado científico",project:"Archivo y legado de ciencia pública",description:"La mascota transmite experiencia y fortalece nuevas vocaciones."},
 ];
/** Toda acción académica es realizada por la mascota; en etapas tempranas recibe acompañamiento adulto.
 * Los CR son recursos simbólicos de juego, nunca salarios de personas menores de edad.
 */
export interface Activity {
 id:string; label:string; icon:string; minStage:number; maxStage:number;
 pa:number; pe:number; credits:number; energy:number; stress:number; focus:number;
 motivation?:number; type:string; flavor:string; performer:'mascota';
}
/**
 * Formato de fila para edición del catálogo:
 * [etapa, claveLocal, título, icono, costoPA, UPEBase, diferenciaCR,
 *  diferenciaEnergía, diferenciaEstrés, diferenciaConcentración, categoría, explicación].
 *
 * IMPORTANTE:
 * - Cada etapa contiene seis actividades EXCLUSIVAS; no acumular actividades previas.
 * - La mascota realiza la acción; el jugador elige/cuido. El campo `flavor`
 *   explica el contexto humano cuando requiere acompañamiento escolar.
 * - CR positivos en Kínder son apoyos simbólicos, nunca salarios ni empleo infantil.
 * - Estos valores son balance lúdico; no equivalen a criterios oficiales.
 *
 * Al modificar una fila: ejecutar `npm test` y revisar el texto de la UI.
 */
type ActivityRow = readonly [stage:number,id:string,label:string,icon:string,pa:number,pe:number,credits:number,energy:number,stress:number,focus:number,type:string,flavor:string];
// El primer número (0..13) coincide con la posición del arreglo STAGES.
// Mantener las filas agrupadas por etapa facilita auditar niveles y costes.
const ACTIVITY_ROWS: readonly ActivityRow[] = [
  [0,"colores","Identificar colores y formas","🎨",3,10,0,-2,0,2,"juego","La mascota distingue figuras con tarjetas, guiada por su docente."],
  [0,"bloques","Construir con bloques","🧱",4,12,-1,-3,0,2,"juego","La mascota prueba tamaños y equilibrio con piezas seguras."],
  [0,"semillas","Explorar semillas","🌱",4,13,-2,-3,1,3,"exploracion","La mascota observa una semilla y pregunta qué necesita para crecer."],
  [0,"cuento","Narrar un cuento ilustrado","📖",4,11,-1,-2,-1,2,"lenguaje","La mascota cuenta una historia con imágenes y ayuda del adulto."],
  [0,"compartir","Compartir juguetes en el aula","🧸",3,9,4,-2,-2,1,"convivencia","La mascota organiza un intercambio de materiales; gana créditos ficticios de apoyo escolar, no un sueldo."],
  [0,"dibujar","Dibujar lo que descubrió","🖍️",4,14,-2,-3,0,3,"creatividad","La mascota expresa observaciones con dibujos sin calificaciones formales."],
  [1,"lectura","Leer y resumir un cuento","📗",4,11,-1,-3,1,3,"lenguaje","La mascota practica comprensión lectora con textos apropiados a primaria."],
  [1,"sumas","Resolver problemas matemáticos","➕",5,13,-1,-4,2,4,"estudio","La mascota usa operaciones y explica los pasos."],
  [1,"planta","Registrar el crecimiento de una planta","🌻",5,14,-2,-3,1,3,"exploracion","La mascota observa cambios diarios en una planta escolar."],
  [1,"exposicion","Preparar una exposición escolar","🎤",6,16,-2,-4,2,2,"comunicacion","La mascota presenta un tema sencillo frente a su grupo."],
  [1,"intercambio","Intercambiar libros usados","📚",4,10,4,-2,-1,2,"convivencia","La mascota participa con acompañamiento en el intercambio de útiles; los CR son apoyos ficticios."],
  [1,"mapa","Dibujar un mapa de la comunidad","🗺️",5,13,-1,-3,0,3,"exploracion","La mascota identifica lugares, rutas y servicios de su colonia."],
  [2,"laboratorio","Realizar práctica escolar segura","🔎",6,15,-3,-5,3,3,"exploracion","La mascota sigue una guía sencilla y registra observaciones."],
  [2,"ecuaciones","Resolver ecuaciones básicas","🧮",5,14,-1,-4,2,4,"estudio","La mascota aplica álgebra introductoria y comprueba resultados."],
  [2,"debate","Participar en debate escolar","🗣️",5,14,-1,-3,2,2,"comunicacion","La mascota aprende a argumentar y escuchar opiniones diferentes."],
  [2,"fuentes","Comparar fuentes de información","📰",5,14,-1,-3,1,3,"investigacion","La mascota identifica fuentes confiables para una tarea escolar."],
  [2,"club","Colaborar en club de tareas","🤝",4,12,5,-3,-1,2,"convivencia","La mascota intercambia apuntes y recursos con su grupo; recibe CR simbólicos."],
  [2,"reporte","Redactar un reporte de ciencia","🧾",6,17,-2,-5,3,4,"escritura","La mascota presenta pregunta, método y hallazgos escolares."],
  [3,"plan","Diseñar un prototipo técnico","📐",7,18,-3,-5,3,3,"tecnica","La mascota dibuja un diseño con materiales y función definidos."],
  [3,"seguridad","Aplicar normas de seguridad en taller","🥽",7,17,-4,-5,2,4,"tecnica","La mascota aprende a usar equipo de protección y registrar riesgos."],
  [3,"bitacora","Mantener bitácora de prácticas","📒",6,16,-2,-4,2,4,"escritura","La mascota documenta procesos, pruebas y resultados técnicos."],
  [3,"maqueta","Probar y ajustar una maqueta","⚙️",7,20,-4,-6,4,3,"tecnica","La mascota compara un diseño con su funcionamiento observado."],
  [3,"feria","Participar en feria técnica escolar","🏗️",5,14,6,-4,1,2,"comunicacion","La mascota recibe materiales simbólicos de apoyo por compartir su trabajo."],
  [3,"certificar","Practicar para la certificación técnica","🏷️",8,21,-3,-6,4,4,"estudio","La mascota refuerza habilidades del taller con pruebas simuladas."],
  [4,"seminario","Cursar seminario de licenciatura","🎓",6,18,-2,-4,2,3,"estudio","La mascota discute fundamentos y bibliografía de su disciplina."],
  [4,"practica","Hacer práctica universitaria","🧪",8,21,-4,-6,3,3,"investigacion","La mascota ejecuta un protocolo de laboratorio o campo supervisado."],
  [4,"bibliografia","Revisar literatura académica guiada","📚",6,19,-2,-4,2,4,"estudio","La mascota distingue fuentes primarias y secundarias."],
  [4,"integrador","Desarrollar proyecto integrador","🛠️",8,23,-4,-6,4,3,"investigacion","La mascota combina métodos aprendidos para resolver un problema."],
  [4,"asesoria_pares","Impartir asesoría entre pares","🧑‍🏫",6,14,6,-4,1,2,"docencia","La mascota enseña un tema que domina a otros universitarios; gana CR de juego."],
  [4,"cartel","Presentar un cartel académico","📊",7,21,-3,-5,3,2,"comunicacion","La mascota explica objetivos y resultados en una jornada universitaria."],
  [5,"caso","Atender caso simulado bajo supervisión","🩺",8,23,-4,-6,4,3,"especialidad","La mascota toma decisiones formativas con apoyo profesional."],
  [5,"protocolo","Aplicar protocolo especializado","🧬",9,26,-5,-7,4,4,"especialidad","La mascota practica técnicas avanzadas dentro de una simulación."],
  [5,"informe","Redactar informe técnico","📄",8,24,-3,-5,3,4,"escritura","La mascota comunica resultados y límites de un procedimiento."],
  [5,"discusion","Analizar un caso con especialistas","💬",7,21,-2,-4,1,3,"colaboracion","La mascota contrasta enfoques y razona alternativas."],
  [5,"consultoria","Ofrecer asesoría especializada simulada","🧑‍💼",6,16,7,-4,2,2,"docencia","La mascota explica herramientas de su especialidad y obtiene CR ficticios."],
  [5,"mejora","Proponer una mejora de práctica","🔧",8,25,-4,-6,3,3,"especialidad","La mascota diseña mejoras con evaluación responsable."],
  [6,"pregunta","Formular la pregunta de tesis","❓",7,25,-2,-4,2,4,"investigacion","La mascota delimita un problema viable y relevante."],
  [6,"revision","Revisión bibliográfica de maestría","📖",8,27,-3,-5,3,4,"investigacion","La mascota sintetiza antecedentes y vacíos de conocimiento."],
  [6,"datos","Analizar datos de tesis","📈",9,29,-4,-6,4,3,"investigacion","La mascota organiza y evalúa datos sin fabricar resultados."],
  [6,"capitulo","Redactar capítulo de tesis","✍️",9,30,-3,-7,4,3,"escritura","La mascota argumenta sus hallazgos con referencias trazables."],
  [6,"taller","Apoyar taller metodológico","🧑‍🏫",7,19,8,-5,1,2,"docencia","La mascota orienta a otras personas en métodos que domina."],
  [6,"coloquio","Presentar avances en coloquio","🎙️",8,29,-4,-6,4,2,"comunicacion","La mascota recibe preguntas y revisa sus hipótesis."],
  [7,"diseño","Diseñar experimentos originales","🧪",10,31,-5,-7,4,4,"investigacion","La mascota propone experimentos con controles y límites claros."],
  [7,"resultados","Obtener y validar resultados","🔬",11,34,-7,-8,5,3,"investigacion","La mascota repite mediciones y documenta resultados reproducibles."],
  [7,"modelo","Construir modelo de análisis","📐",9,31,-4,-6,4,4,"investigacion","La mascota elige métodos de análisis adecuados al problema doctoral."],
  [7,"articulo","Redactar artículo de investigación original","📝",11,36,-4,-8,5,3,"escritura","La mascota escribe resultados y discute incertidumbres."],
  [7,"seminario","Impartir seminario doctoral","🧑‍🏫",8,24,9,-5,2,2,"docencia","La mascota comparte herramientas avanzadas; gana créditos ficticios."],
  [7,"defensa","Defender avances de tesis","🎓",10,35,-5,-7,6,3,"comunicacion","La mascota responde críticamente las preguntas del comité."],
  [8,"linea","Abrir una línea de investigación","🌐",10,36,-5,-7,4,4,"investigacion","La mascota define nuevas preguntas de investigación posdoctoral."],
  [8,"replicar","Reproducir resultados publicados","🔁",10,34,-5,-7,3,4,"investigacion","La mascota documenta reproducibilidad y problemas metodológicos."],
  [8,"codirigir","Codirigir proyecto colaborativo","🤝",9,33,-4,-6,3,3,"colaboracion","La mascota coordina una tarea dentro de un equipo científico."],
  [8,"propuesta","Redactar propuesta de financiamiento","📑",11,38,-5,-7,5,3,"gestion","La mascota justifica objetivos, tiempos, riesgos y costos."],
  [8,"formacion","Impartir taller avanzado","🧑‍🏫",8,26,10,-5,2,2,"docencia","La mascota forma a colegas en una técnica especializada."],
  [8,"abiertos","Publicar datos abiertos responsables","🗂️",10,36,-4,-7,3,4,"comunicacion","La mascota documenta metadatos y resguarda información sensible."],
  [9,"produccion","Organizar producción científica inicial","📚",10,37,-5,-7,4,4,"gestion","La mascota organiza sus productos de investigación con trazabilidad."],
  [9,"impacto","Documentar impacto social","🌱",9,32,-3,-6,2,3,"comunicacion","La mascota registra actividades de vinculación con comunidades."],
  [9,"expediente","Preparar expediente académico ficticio","🗃️",8,29,-3,-5,4,4,"gestion","La mascota reúne evidencias lúdicas; no equivale a un trámite SNII real."],
  [9,"redes","Colaborar con otra institución","🌍",8,32,-3,-6,2,3,"colaboracion","La mascota inicia colaboración basada en resultados y reciprocidad."],
  [9,"mentoria","Impartir tutoría investigadora","🧑‍🏫",8,25,10,-5,1,2,"docencia","La mascota guía a personal en formación; obtiene créditos de juego."],
  [9,"divulgacion","Organizar charla comunitaria","🎤",8,30,-2,-5,1,2,"comunicacion","La mascota comparte hallazgos comprensibles fuera de su disciplina."],
  [10,"direccion","Coordinar investigación en curso","🧭",11,42,-5,-7,4,4,"gestion","La mascota planifica entregables y revisa responsabilidades."],
  [10,"arbitraje","Revisar manuscrito con integridad","🔍",9,35,-3,-6,3,4,"evaluacion","La mascota revisa evidencias y propone mejoras sin sesgos."],
  [10,"tesis","Dirigir tesis con acompañamiento","🎓",10,38,-4,-7,3,3,"docencia","La mascota acompaña a estudiantes con retroalimentación oportuna."],
  [10,"pares","Evaluar proyectos de pares","⚖️",10,37,-3,-6,3,4,"evaluacion","La mascota valora criterios y comunica conflictos de interés."],
  [10,"asesoria","Ofrecer asesoría académica","💼",8,27,12,-5,2,3,"docencia","La mascota apoya equipos y recibe créditos simbólicos."],
  [10,"extension","Desarrollar iniciativa comunitaria","🤲",10,37,-4,-6,2,3,"comunicacion","La mascota trabaja con actores sociales para resolver necesidades reales."],
  [11,"red","Liderar red interinstitucional","🕸️",12,46,-6,-8,5,4,"colaboracion","La mascota coordina agendas y conocimientos entre instituciones."],
  [11,"formacion","Formar nuevas personas investigadoras","🧑‍🏫",11,41,-5,-7,3,3,"docencia","La mascota orienta tesis y relevo generacional con ética."],
  [11,"consolidar","Consolidar línea científica","🔬",12,47,-6,-8,5,4,"investigacion","La mascota profundiza preguntas con resultados acumulativos."],
  [11,"evaluar","Evaluar programas de investigación","📋",10,40,-4,-6,4,3,"evaluacion","La mascota analiza resultados, impacto y restricciones."],
  [11,"transferir","Asesorar transferencia responsable","🤝",9,33,13,-6,2,3,"colaboracion","La mascota acerca conocimiento a su entorno y recibe CR lúdicos."],
  [11,"congreso","Organizar simposio especializado","🎙️",11,42,-5,-7,4,3,"comunicacion","La mascota fomenta intercambio abierto y discusión crítica."],
  [12,"estrategia","Diseñar estrategia científica colectiva","🧭",13,50,-7,-9,5,4,"gestion","La mascota impulsa prioridades de un equipo experimentado."],
  [12,"consorcio","Coordinar consorcio interdisciplinario","🌐",13,52,-7,-9,6,4,"colaboracion","La mascota integra capacidades y criterios responsables."],
  [12,"integridad","Promover políticas de integridad","⚖️",11,45,-4,-7,3,4,"evaluacion","La mascota crea prácticas de transparencia y protección de datos."],
  [12,"ciencia_abierta","Impulsar iniciativa de ciencia abierta","🔓",12,50,-5,-8,4,4,"comunicacion","La mascota promueve acceso y reproducibilidad sin exponer datos privados."],
  [12,"red_asesoria","Asesorar redes de investigación","🧑‍🏫",9,35,15,-6,2,3,"docencia","La mascota facilita formación y planificación; recibe CR lúdicos."],
  [12,"sintesis","Escribir obra de síntesis","📚",13,53,-6,-8,5,4,"escritura","La mascota integra décadas ficticias de investigación."],
  [13,"acompanar","Acompañar nuevas generaciones","🤝",10,48,-2,-6,0,2,"docencia","La mascota ofrece mentoría y escucha a investigadores jóvenes."],
  [13,"archivo","Preservar archivo científico","🗃️",11,49,-3,-6,1,4,"gestion","La mascota organiza materiales históricos y reconoce colaboraciones."],
  [13,"memorias","Escribir memorias académicas","✍️",12,51,-4,-7,2,4,"escritura","La mascota narra aciertos, errores y aprendizajes de la trayectoria."],
  [13,"consejo","Participar en consejo científico honorario","🏛️",10,46,-3,-5,2,3,"evaluacion","La mascota ofrece criterio sin imponer autoridad automática."],
  [13,"mentoria","Impartir mentoría distinguida","🧑‍🏫",9,39,17,-5,-1,3,"docencia","La mascota transmite experiencia y recibe créditos simbólicos."],
  [13,"vocaciones","Organizar feria de vocaciones científicas","✨",11,48,-3,-6,0,3,"comunicacion","La mascota inspira la curiosidad de nuevas generaciones."],
 ];
/** La etiqueta de etapa forma parte de la clave de actividad para evitar colisiones entre niveles. */
export const ACTIVITIES: readonly Activity[] = ACTIVITY_ROWS.map(([stage,id,label,icon,pa,pe,credits,energy,stress,focus,type,flavor]) => ({
 id:`etapa${stage}-${id}`,label,icon,minStage:stage,maxStage:stage,
 pa,pe,credits,energy,stress,focus,type,flavor,performer:'mascota'
}));
/** Permite mostrar solo las actividades vigentes, en lugar de acumular tareas de niveles anteriores. */
/** Selecciona actividades jugables de una etapa; no modifica el catálogo maestro. */
export const activitiesForStage=(stageIndex:number):Activity[]=>ACTIVITIES.filter(a=>stageIndex>=a.minStage && stageIndex<=a.maxStage);
