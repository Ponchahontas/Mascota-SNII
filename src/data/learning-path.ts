/**
 * @module data/learning-path
 * Biblioteca de acompañamiento educativo para las 14 etapas ficticias.
 *
 * PRINCIPIOS:
 * - El usuario acompaña, pregunta y elige; la mascota aprende y realiza la actividad.
 * - Cada una de las 84 actividades tiene un desafío propio y retroalimentación.
 * - Los errores son oportunidades: nunca descuentan puntos ni producen deserción.
 * - Los criterios SNII de este juego son satíricos; NO son normatividad oficial.
 * - Los textos no se utilizan como HTML sin esc() en ui/app.ts.
 * - Los retos se pueden repetir sin límite; la puntuación se concede SOLO si
 *   el usuario confirma una actividad válida por el motor transaccional.
 */
import { ACTIVITIES, STAGES } from './catalog.js';

/** Narrativa, competencias y papel del jugador para cada etapa. */
export interface LearningStage {
  chapter: string;
  hook: string;
  purpose: string;
  whatHappens: string;
  companion: string;
  realWorld: string;
  closing: string;
}
export const LEARNING_STAGES: readonly LearningStage[] = [
  {
    chapter:'El jardín de las preguntas',hook:'¿Y si aprender fuera una aventura?',
    purpose:'Explorar, jugar, expresarse y aprender a convivir.',
    whatHappens:'En preescolar, el juego ayuda a descubrir colores, formas, palabras, emociones y formas de colaborar. No se trata de producir artículos ni aprobar exámenes universitarios.',
    companion:'Escucha sus preguntas, deja que pruebe, celebra sus intentos y ayúdala a descansar. Tú no resuelves el reto por ella.',
    realWorld:'Un dibujo, una torre que se cae o una pregunta sobre una semilla pueden iniciar una investigación infantil.',
    closing:'En esta etapa, equivocarse, observar y volver a intentar también es aprender.'
  },
  {
    chapter:'La expedición de las palabras',hook:'¡Cada libro y cada número abre una puerta!',
    purpose:'Leer con comprensión, calcular, observar y explicar ideas sencillas.',
    whatHappens:'En primaria se practican habilidades básicas que permiten comprender el entorno: lectura, matemáticas, convivencia y exploración de fenómenos cotidianos.',
    companion:'Pregunta cómo encontró la respuesta, no solo si acertó. Permite que se explique con dibujos, objetos o palabras.',
    realWorld:'Contar semillas, leer instrucciones y hacer un mapa del barrio son formas de usar lo aprendido.',
    closing:'Aprender no es memorizar una cifra: es poder explicar de dónde salió.'
  },
  {
    chapter:'El club de las hipótesis',hook:'¡Ya podemos preguntar «¿cómo lo sabemos?»!',
    purpose:'Argumentar, comparar fuentes, experimentar de forma segura y colaborar.',
    whatHappens:'En secundaria el alumnado puede empezar a distinguir observaciones, opiniones, evidencias e interpretaciones en proyectos escolares.',
    companion:'Anímala a justificar sus ideas y escuchar otras perspectivas; una respuesta inicial puede mejorarse con evidencias.',
    realWorld:'Un experimento escolar sencillo es más útil cuando registra qué cambió y qué se mantuvo constante.',
    closing:'Pensar críticamente también significa cambiar de opinión cuando aparecen mejores datos.'
  },
  {
    chapter:'Inventos con propósito',hook:'¡De la idea al primer prototipo!',
    purpose:'Planificar proyectos, practicar seguridad y registrar soluciones técnicas.',
    whatHappens:'La preparatoria técnica combina conocimientos generales con prácticas guiadas, resolución de problemas y herramientas de trabajo.',
    companion:'Ayúdala a reconocer los riesgos antes de usar herramientas y a comparar el diseño con sus resultados.',
    realWorld:'Los prototipos requieren pruebas, documentación y cambios; no nacen perfectos.',
    closing:'Un buen proyecto técnico no es el más complejo, sino el que resuelve algo de forma responsable.'
  },
  {
    chapter:'El campus de las preguntas grandes',hook:'¡Ahora las ideas necesitan métodos!',
    purpose:'Conectar teoría, evidencia, trabajo en equipo y comunicación académica.',
    whatHappens:'La educación universitaria profundiza conocimientos de una disciplina y enseña a buscar fuentes, aplicar métodos y construir argumentos.',
    companion:'Invítala a distinguir lo que sabe de lo que todavía necesita investigar; no confundas rapidez con aprendizaje.',
    realWorld:'Una investigación universitaria puede empezar con un problema de la comunidad y un proyecto bien delimitado.',
    closing:'La curiosidad crece cuando se acompaña de método y pensamiento ético.'
  },
  {
    chapter:'El taller de las decisiones responsables',hook:'¡Saber mucho también exige reconocer límites!',
    purpose:'Aplicar conocimientos avanzados con supervisión y criterio profesional.',
    whatHappens:'Una especialidad profundiza la práctica en un campo; sus actividades pueden ser muy diferentes según la disciplina.',
    companion:'Pregúntale qué información falta, qué riesgos existen y cuándo conviene consultar a otra persona especialista.',
    realWorld:'Documentar un procedimiento y reconocer incertidumbre son partes esenciales de una buena práctica.',
    closing:'La responsabilidad profesional incluye saber cuándo detenerse y pedir apoyo.'
  },
  {
    chapter:'La brújula de la tesis',hook:'¡Una buena pregunta puede guiar meses de trabajo!',
    purpose:'Delimitar un problema y aprender a investigar de forma sistemática.',
    whatHappens:'En maestría se fortalecen el diseño de investigación, la lectura crítica, el análisis y la escritura académica.',
    companion:'Ayúdala a transformar preguntas demasiado amplias en preguntas posibles de responder con tiempo y recursos reales.',
    realWorld:'La tesis busca responder una pregunta con métodos claros y resultados discutibles, no producir certeza absoluta.',
    closing:'Una duda bien planteada es más valiosa que una respuesta sin fundamento.'
  },
  {
    chapter:'El laboratorio de lo desconocido',hook:'¡Llegó el momento de aportar conocimiento original!',
    purpose:'Diseñar, validar, discutir y comunicar investigación original.',
    whatHappens:'El doctorado implica profundizar en preguntas originales, sostener argumentos ante críticas y documentar procedimientos reproducibles.',
    companion:'Recuérdale que los resultados inesperados son información y que el descanso también protege la calidad de la investigación.',
    realWorld:'Los errores, controles experimentales y límites del estudio importan tanto como los hallazgos llamativos.',
    closing:'Ser investigador no significa tener siempre razón, sino aprender a poner a prueba las ideas.'
  },
  {
    chapter:'Nuevos caminos científicos',hook:'¡Investigar también es colaborar y abrir preguntas!',
    purpose:'Desarrollar autonomía, reproducibilidad y trabajo entre equipos.',
    whatHappens:'El posdoctorado es una etapa de investigación avanzada que puede incluir nuevas líneas, colaboraciones y formación especializada.',
    companion:'Ayúdala a equilibrar ambición, recursos, responsabilidad y reconocimiento justo del trabajo colaborativo.',
    realWorld:'Compartir métodos de forma responsable puede hacer que otros equipos comprueben o amplíen los resultados.',
    closing:'La ciencia avanza cuando el conocimiento puede discutirse y comprobarse.'
  },
  {
    chapter:'El expediente de la coherencia',hook:'¡No basta con investigar: hay que explicar su aporte!',
    purpose:'Organizar evidencia verificable y explicar la responsabilidad social de la investigación.',
    whatHappens:'En la ruta ficticia de Candidato SNII, la mascota reflexiona sobre su trayectoria y documenta contribuciones con integridad. No representa requisitos oficiales.',
    companion:'Pídele que documente el trabajo con claridad, reconozca colaboraciones y evite inflar resultados.',
    realWorld:'Un expediente académico responsable distingue hechos verificables, actividades y efectos observados.',
    closing:'El valor de investigar no cabe en un solo número.'
  },
  {
    chapter:'Conocimiento que se comparte',hook:'¡Investigar y enseñar pueden fortalecer a una comunidad!',
    purpose:'Sostener proyectos, acompañar estudiantes y evaluar evidencia con integridad.',
    whatHappens:'En el Nivel I ficticio, la mascota combina investigación, docencia y divulgación. Las reglas del juego no equivalen a los criterios reales del SNII.',
    companion:'Ayúdala a dar retroalimentación respetuosa y reconocer los aportes de otras personas.',
    realWorld:'Una persona investigadora también crece cuando orienta proyectos y comunica resultados a distintos públicos.',
    closing:'Una trayectoria sólida se reconoce también por cómo cuida a su equipo.'
  },
  {
    chapter:'La red de las buenas preguntas',hook:'¡Los desafíos grandes requieren muchas miradas!',
    purpose:'Coordinar equipos, formar personas y evaluar impacto responsablemente.',
    whatHappens:'El Nivel II ficticio enfatiza liderazgo colaborativo y construcción de redes. Es una interpretación educativa, no una escala oficial de evaluación.',
    companion:'Invítala a escuchar otras disciplinas, asignar responsabilidades claras y compartir los créditos del trabajo.',
    realWorld:'Una red interdisciplinaria funciona mejor cuando acuerda métodos, responsabilidades y formas de resolver desacuerdos.',
    closing:'Liderar no es hacer todo: es facilitar que un equipo aprenda y trabaje mejor.'
  },
  {
    chapter:'El horizonte de la ciencia abierta',hook:'¡El mayor reconocimiento es ampliar posibilidades!',
    purpose:'Impulsar proyectos ambiciosos con transparencia, ética y colaboración.',
    whatHappens:'En el Nivel III ficticio se exploran decisiones sobre grandes proyectos, acceso responsable a datos y formación de nuevas personas investigadoras.',
    companion:'Anímala a pensar en el beneficio público, la integridad de la evidencia y las personas que participan.',
    realWorld:'Compartir conocimientos no implica divulgar datos personales o ignorar consentimiento y seguridad.',
    closing:'El impacto duradero necesita confianza, no solo visibilidad.'
  },
  {
    chapter:'El árbol de las generaciones',hook:'¡Una buena historia científica inspira nuevas preguntas!',
    purpose:'Mentorear, preservar la memoria y transmitir aprendizajes.',
    whatHappens:'La etapa Emérito es un homenaje lúdico al legado académico. No pretende representar las condiciones oficiales de esa distinción.',
    companion:'Pregúntale qué errores enseñaron más, a quién reconoce y qué consejos transmitiría a quienes comienzan.',
    realWorld:'Guardar cuadernos, reconocer colaboraciones y compartir experiencias permite que otros continúen proyectos.',
    closing:'La curiosidad es un legado más grande que cualquier medalla.'
  },
] as const;

/**
 * Una pregunta contextual abre la actividad sin alterar la economía.
 * `correct` señala la alternativa pedagógicamente preferible en este
 * escenario. `explanation` cuenta el porqué y `hint` apoya reintentos.
 */
export interface LearningChallenge {
  activityId:string;
  scene:string;
  question:string;
  options:readonly [string,string,string];
  correct:0|1|2;
  explanation:string;
  hint:string;
}
type ChallengeRow = readonly [id:string,scene:string,question:string,first:string,second:string,third:string,correct:0|1|2,explanation:string,hint:string];
const ROWS: readonly ChallengeRow[] = [
  // Kínder: elecciones concretas, cortas y cercanas al juego cotidiano.
  ['etapa0-colores','Encontré tres tarjetas de colores.','¿Cuál tarjeta tiene forma de triángulo?','🔴 Círculo rojo','🔺 Triángulo rojo','🟦 Cuadrado azul',1,'Un triángulo tiene tres lados y tres esquinas; puede ser de cualquier color.','Cuenta los lados, no te fijes solo en el color.'],
  ['etapa0-bloques','Mi torre se cae una y otra vez.','¿Qué podría probar para hacerla más estable?','Poner bloques grandes abajo','Poner el bloque más pequeño debajo','Lanzar los bloques',0,'Una base ancha ayuda a sostener una torre. Probar de nuevo también es investigar.','Piensa en qué parte sostiene todo lo demás.'],
  ['etapa0-semillas','Encontré una semilla en el jardín.','¿Qué le ayudaría a comenzar a crecer?','Pintarla con plumones','Guardarla en una caja muy seca','Darle agua y un ambiente adecuado',2,'Para germinar, muchas semillas necesitan agua, aire y una temperatura apropiada.','Una semilla es un ser vivo en desarrollo: ¿qué necesita?'],
  ['etapa0-cuento','El personaje encontró una puerta misteriosa.','¿Qué hace que un cuento sea fácil de seguir?','Contar primero, después y al final','Mezclar todas las escenas sin orden','Decir solo la última palabra',0,'Los cuentos tienen una secuencia; las imágenes pueden ayudarnos a narrarla.','Piensa en lo que ocurre antes y después.'],
  ['etapa0-compartir','Dos amigos quieren el mismo oso de peluche.','¿Qué podrían hacer para jugar los dos?','Esconder el oso','Turnarse y conversar','Arrebatarlo',1,'Compartir, escuchar y acordar turnos ayuda a convivir sin hacer daño.','¿Cuál opción deja espacio para ambos?'],
  ['etapa0-dibujar','Quiero dibujar una flor que vi.','¿Cómo registro mejor mi descubrimiento?','Dibujo lo que observé y cuento qué vi','Copio una flor sin mirarla','Digo que toda flor es igual',0,'Dibujar lo que observamos es una forma temprana de registrar evidencia.','Observa primero; después representa lo que viste.'],
  // Primaria: pensamiento numérico, registro y comprensión.
  ['etapa1-lectura','Leí un cuento sobre una tortuga perseverante.','¿Qué ayuda a explicar el cuento a otra persona?','Repetir una palabra al azar','Contar de qué trata con mis palabras','Olvidar personajes y sucesos',1,'Resumir significa reconocer las ideas principales y expresarlas con palabras propias.','¿Qué información permite comprender la historia?'],
  ['etapa1-sumas','Tengo tres semillas y me regalaron cuatro.','¿Cuántas semillas tengo ahora?','6','8','7',2,'Tres más cuatro son siete. Puedes comprobarlo contando objetos.','Cuenta las tres primeras y añade cuatro más.'],
  ['etapa1-planta','Medí una planta el lunes y el viernes.','¿Cómo sé si creció?','Comparo las dos medidas anotadas','Solo digo que creció mucho','Le pregunto sin medir',0,'Registrar fechas y medidas permite comparar observaciones a lo largo del tiempo.','¿Qué dos datos necesitas comparar?'],
  ['etapa1-exposicion','Voy a contar a mi grupo qué descubrí.','¿Cómo preparo una exposición clara?','Solo grito el título','Explico tema, ejemplos y conclusión','Leo todo sin hacer pausas',1,'Organizar ideas y utilizar ejemplos ayuda a que otros entiendan lo aprendido.','Piensa en el inicio, el desarrollo y el cierre.'],
  ['etapa1-intercambio','En la feria de libros hay ejemplares limitados.','¿Qué acuerdo sería justo?','Tomar todos los libros','Esconder los sobrantes','Organizar turnos y explicar las reglas',2,'Los acuerdos transparentes y respetuosos permiten compartir recursos limitados.','Busca una opción que todas las personas puedan conocer.'],
  ['etapa1-mapa','Quiero mostrar cómo llegar a la biblioteca.','¿Qué debe tener un mapa útil?','Lugares y símbolos fáciles de entender','Solo colores sin referencias','Una ruta inventada como si fuera real',0,'Los mapas representan lugares mediante referencias, símbolos y rutas.','¿Qué ayudaría a encontrar la biblioteca?'],
  // Secundaria: pensamiento crítico y justificación.
  ['etapa2-laboratorio','Dos vasos tienen semillas y solo uno recibe agua.','¿Qué cambió en esta comparación?','El tipo de semilla','La cantidad de agua','El número de vasos',1,'Cambiar una condición y registrar diferencias ayuda a explorar posibles efectos.','¿Qué recibió uno de los vasos y el otro no?'],
  ['etapa2-ecuaciones','Escribí x + 3 = 9 en el pizarrón.','¿Qué valor tiene x?','12','3','6',2,'Restar 3 a ambos lados da x = 6. Comprobar: 6 + 3 = 9.','¿Qué número sumado con tres da nueve?'],
  ['etapa2-debate','Alguien piensa diferente en el debate escolar.','¿Qué fortalece mi argumento?','Escuchar y aportar razones verificables','Interrumpir con fuerza','Repetir mi opinión muchas veces',0,'Un debate razonado distingue ideas, argumentos y evidencia; escuchar no significa estar de acuerdo.','Piensa cómo se comprueba una afirmación.'],
  ['etapa2-fuentes','Encontré dos notas sobre una noticia.','¿Qué hago antes de darla por cierta?','Comparto la primera sin leer','Reviso fecha, autoría y otras fuentes','Elijo la que usa más mayúsculas',1,'Revisar procedencia, fecha y corroboración ayuda a valorar la calidad de información.','¿Cuál opción permite verificar?'],
  ['etapa2-club','Una compañera pide ayuda con su tarea.','¿Qué forma de ayuda le permite aprender?','Hacer toda su tarea','Copiar las respuestas','Explicarle el procedimiento y dejarle intentar',2,'Enseñar a razonar ayuda más que entregar una respuesta sin comprenderla.','¿Cómo apoyas sin hacer el trabajo ajeno?'],
  ['etapa2-reporte','Mi experimento dio un resultado inesperado.','¿Qué escribo en mi reporte?','Lo observado aunque no lo esperara','Un resultado inventado más bonito','Solo la conclusión deseada',0,'Un reporte científico registra lo que ocurrió, no lo que queríamos que ocurriera.','La evidencia importa más que la expectativa.'],
  // Preparatoria técnica: planificación y seguridad.
  ['etapa3-plan','Necesito diseñar un filtro de agua de demostración.','¿Por dónde empiezo?','Compro materiales sin plan','Defino el problema y los requisitos','Afirmo que limpia cualquier agua',1,'Delimitar función, recursos y seguridad evita promesas que un prototipo no puede cumplir.','Un diseño empieza por entender qué debe resolver.'],
  ['etapa3-seguridad','Voy a iniciar una práctica de taller.','¿Qué hago antes de usar herramientas?','Ignoro el equipo de protección','Pruebo sin leer instrucciones','Reviso riesgos, instrucciones y protección',2,'Identificar riesgos y usar protección adecuada es parte de cualquier trabajo técnico responsable.','¿Qué harías antes de empezar una tarea con riesgo?'],
  ['etapa3-bitacora','La maqueta funcionó distinto el miércoles.','¿Qué anoto en la bitácora?','Fecha, condiciones y resultado observado','Solo «funcionó raro»','Borro los intentos que fallaron',0,'Una bitácora detallada ayuda a repetir pruebas y encontrar por qué cambió el resultado.','¿Qué datos podría necesitar otra persona?'],
  ['etapa3-maqueta','La hélice de mi maqueta no gira bien.','¿Cómo pruebo una mejora?','Cambio todo a la vez','Modifico una cosa y registro el efecto','Declaro que ya funciona',1,'Probar cambios controlados facilita identificar cuáles mejoras funcionaron.','¿Qué cambio permitiría saber qué causó el resultado?'],
  ['etapa3-feria','Voy a mostrar mi prototipo en la feria.','¿Cómo demuestro qué hace?','Uso un nombre muy ruidoso','Oculto sus limitaciones','Explico propósito, prueba y resultados',2,'Mostrar método y límites hace una presentación técnica más clara y responsable.','¿Qué necesita saber quien quiere probarlo?'],
  ['etapa3-certificar','Estoy practicando una habilidad técnica.','¿Qué demuestra que la domino?','Ejecutar la tarea con seguridad y explicar pasos','Memorizar el título del certificado','Decir que nunca me equivoco',0,'Una habilidad se evidencia con práctica correcta, criterios claros y capacidad de explicar el proceso.','¿Qué podrías mostrar, no solo decir?'],
  // Universidad: métodos, bibliografía y colaboración.
  ['etapa4-seminario','El seminario presenta dos teorías sobre un problema.','¿Qué pregunta ayuda a compararlas?','¿Cuál parece más famosa?','¿Qué evidencia sustenta cada una?','¿Cuál tiene más palabras?',1,'Las teorías se comparan atendiendo a sus supuestos, predicciones y evidencia disponible.','Busca pruebas, no popularidad.'],
  ['etapa4-practica','En una práctica los datos varían demasiado.','¿Cómo reviso mediciones inesperadamente variables?','Invento un promedio bonito','Descarto todo sin revisar','Reviso instrumentos y procedimiento',2,'Antes de interpretar datos es importante evaluar mediciones y posibles fuentes de error.','¿Qué puede estar provocando la variación?'],
  ['etapa4-bibliografia','Tengo un artículo de investigación y una opinión anónima.','¿Cuál permite rastrear mejor un método original?','El artículo con método y referencias','La opinión sin autor ni fuente','El texto con más imágenes',0,'Una fuente primaria suele describir procedimientos o resultados originales que pueden evaluarse.','Piensa qué documento explica cómo obtuvo sus datos.'],
  ['etapa4-integrador','Mi equipo quiere resolver un problema comunitario.','¿Qué paso conviene primero?','Elegir solución sin escuchar','Definir necesidad con las personas involucradas','Ignorar efectos secundarios',1,'Comprender el contexto y a las personas usuarias mejora el diseño responsable.','¿A quién afecta el problema?'],
  ['etapa4-asesoria_pares','Un compañero no entiende un concepto.','¿Qué hace buena una asesoría entre pares?','Dar la respuesta para copiar','Ridiculizar sus errores','Usar un ejemplo y pedirle que explique',2,'Pedir a alguien que razone con sus palabras ayuda a construir comprensión autónoma.','¿Qué opción enseña, en vez de sustituir?'],
  ['etapa4-cartel','Mi cartel tiene muchos resultados.','¿Qué debería distinguirse con facilidad?','Pregunta, método y hallazgos principales','Una pared de texto diminuto','Solo el logotipo',0,'Un cartel comunica una historia de investigación con información legible y verificable.','¿Qué necesita entender quien no conoce el trabajo?'],
  // Especialidad: casos, límites y ética.
  ['etapa5-caso','Tengo un caso simulado con información incompleta.','¿Qué decisión es prudente?','Actuar sin consultar','Solicitar información y supervisión adecuadas','Fingir certeza absoluta',1,'Reconocer incertidumbre y trabajar bajo supervisión protege la calidad de una decisión profesional.','¿Qué necesitas saber antes de intervenir?'],
  ['etapa5-protocolo','Una técnica requiere pasos de seguridad definidos.','¿Qué hago si un paso no sale como se esperaba?','Oculto el incidente','Continúo sin registrar','Detengo, documento y consulto el protocolo',2,'Registrar desviaciones y consultar procedimientos ayuda a aprender y gestionar riesgos.','¿Se puede ignorar un resultado inesperado?'],
  ['etapa5-informe','El informe incluye un hallazgo con datos incompletos.','¿Cómo lo redacto responsablemente?','Describo resultados y limitaciones','Escribo que es una verdad definitiva','Elimino las dudas sin explicar',0,'La precisión incluye explicar qué se sabe y qué no puede concluirse todavía.','Los límites también son información.'],
  ['etapa5-discusion','Dos especialistas ofrecen interpretaciones distintas.','¿Qué ayuda a tomar una decisión?','Elegir por jerarquía sin preguntar','Comparar evidencia, riesgos y supuestos','Ignorar ambas posturas',1,'El diálogo interdisciplinario hace explícitos los supuestos y la evidencia de cada alternativa.','¿Cómo se contrastan dos opciones?'],
  ['etapa5-consultoria','Me piden asesorar sobre un problema complejo.','¿Qué debo decir si algo excede mi experiencia?','Prometer resultados inmediatos','Inventar una respuesta','Explicar límites y recomendar apoyo adecuado',2,'Una asesoría ética reconoce alcances y no promete lo que no puede justificar.','Saber pedir ayuda también demuestra competencia.'],
  ['etapa5-mejora','Propuse una mejora al procedimiento.','¿Cómo sé si realmente ayuda?','Defino un indicador y comparo resultados','Me quedo solo con la intuición','Elimino las mediciones previas',0,'Para evaluar mejoras se necesitan criterios y comparaciones, no solo entusiasmo.','¿Qué evidencias demostrarían el cambio?'],
  // Maestría: pregunta, evidencia y redacción.
  ['etapa6-pregunta','Quiero estudiar «todo sobre plantas».','¿Qué versión es más investigable?','¿Son importantes todas las plantas?','¿Cómo cambia la germinación de una especie con la luz?','¿Cuál es la mejor planta del mundo?',1,'Una buena pregunta delimita objeto, condiciones y una variable observable.','Busca una pregunta acotada y verificable.'],
  ['etapa6-revision','Leí estudios que parecen contradecirse.','¿Qué hago en la revisión de literatura?','Escojo el que confirma mi idea','Los cito sin leerlos','Comparo métodos, condiciones y hallazgos',2,'Las diferencias metodológicas pueden explicar resultados distintos; la revisión busca comprenderlas.','¿En qué pueden diferir las investigaciones?'],
  ['etapa6-datos','Dos variables aparecen correlacionadas.','¿Qué puedo afirmar con seguridad?','Hay una asociación, no necesariamente causalidad','Una causa a la otra sin duda','La gráfica es una prueba definitiva',0,'La correlación por sí sola no demuestra causa y efecto.','¿Qué tipo de relación muestran los datos?'],
  ['etapa6-capitulo','Voy a escribir mi capítulo de resultados.','¿Qué debe acompañar una afirmación importante?','Un adjetivo emocionante','Evidencia y referencia trazable','Una frase que suene académica',1,'Las fuentes y los datos permiten que otras personas evalúen la solidez del argumento.','¿Cómo podría alguien comprobar lo que afirmas?'],
  ['etapa6-taller','Una compañera se equivoca al aplicar un método.','¿Cómo acompaño su aprendizaje?','Regañándola delante del grupo','Haciendo todo el ejercicio','Pidiendo su razonamiento y ofreciendo una pista',2,'La retroalimentación guiada permite corregir y conservar autonomía.','Una pista ayuda más que sustituir a la persona.'],
  ['etapa6-coloquio','En el coloquio cuestionan mi muestra.','¿Qué respuesta favorece la ciencia?','Explico selección, límites y alternativas','Ignoro la pregunta','Afirmo que nunca hay sesgos',0,'Reconocer límites metodológicos fortalece la transparencia de la investigación.','¿Qué le falta saber a quien pregunta?'],
  // Doctorado: originalidad, replicación, incertidumbre.
  ['etapa7-diseño','Dos tratamientos se comparan en un experimento.','¿Para qué sirve un grupo de control pertinente?','Para aumentar la cantidad de fotos','Para interpretar efectos frente a una referencia','Para garantizar que la hipótesis es cierta',1,'Un control adecuado ayuda a distinguir efectos de otras condiciones del experimento.','¿Contra qué compararías el resultado?'],
  ['etapa7-resultados','Mi hipótesis no se confirmó.','¿Qué hago con los datos?','Los ajusto para que cuadren','Los borro sin explicación','Los conservo y analizo las posibles causas',2,'Resultados negativos o inesperados también aportan conocimiento si el método es sólido.','¿La ciencia solo aprende cuando acierta?'],
  ['etapa7-modelo','Mi modelo funciona con datos de entrenamiento.','¿Qué prueba reduce el riesgo de sobreajuste?','Evaluarlo con datos independientes','Solo aumentar su complejidad','Mostrar la gráfica más bonita',0,'Probar con datos no usados en el ajuste ayuda a evaluar generalización.','¿Cómo sabrías si funciona fuera de los ejemplos conocidos?'],
  ['etapa7-articulo','Los resultados tienen incertidumbre.','¿Cómo los comunico en el artículo?','Ocultando intervalos y limitaciones','Describiendo evidencia, alcance e incertidumbre','Presentándolos como leyes universales',1,'El lenguaje científico debe reflejar exactamente qué permiten concluir los datos.','¿Qué necesita saber quien quiera repetir el estudio?'],
  ['etapa7-seminario','Alguien hace una crítica metodológica en el seminario.','¿Cuál es una respuesta productiva?','Cambiar de tema','Descalificar a la persona','Pedir detalles y revisar la evidencia',2,'La crítica fundamentada es una oportunidad de mejorar diseños y argumentos.','Separa las ideas de las personas.'],
  ['etapa7-defensa','El comité señala un punto débil de la tesis.','¿Cómo defiendo el trabajo con rigor?','Reconozco el límite y explico sus implicaciones','Afirmo que el comité no entiende','Invento nuevos datos sobre la marcha',0,'Defender una investigación incluye argumentar sin negar sus limitaciones.','¿Qué demuestra comprensión y honestidad?'],
  // Posdoctorado: autonomía, colaboración y ciencia abierta.
  ['etapa8-linea','Tengo muchas ideas para una nueva línea.','¿Cómo elijo una pregunta inicial viable?','La más grande aunque no haya recursos','La que tiene relevancia y un plan factible','La que promete éxito garantizado',1,'Autonomía científica también implica priorizar preguntas y reconocer recursos.','¿Se puede investigar con los medios disponibles?'],
  ['etapa8-replicar','Quiero reproducir un resultado publicado.','¿Qué debo revisar primero?','Solo la conclusión del resumen','El número de citas','Método, materiales y condiciones reportadas',2,'La replicabilidad depende de información suficiente para realizar un procedimiento comparable.','¿Qué necesitarías para repetir el experimento?'],
  ['etapa8-codirigir','Coordinamos un equipo de varias instituciones.','¿Qué evita confusiones futuras?','Acordar roles y reconocer contribuciones','Dejar todo implícito','Ocultar los acuerdos',0,'La colaboración mejora cuando responsabilidades y autorías se hablan desde el principio.','¿Qué conviene aclarar antes del proyecto?'],
  ['etapa8-propuesta','La convocatoria pide un proyecto bien justificado.','¿Qué debe relacionarse en la propuesta?','Solo una frase inspiradora','Objetivos, métodos, recursos y resultados esperables','Un presupuesto sin actividades',1,'La viabilidad se evalúa al conectar objetivos con método, plazos y recursos.','¿Los costos y tareas responden a los objetivos?'],
  ['etapa8-formacion','Voy a impartir un taller avanzado.','¿Cómo compruebo que el grupo comprendió?','Con una charla sin interacción','Con una lista de asistencia solamente','Con una práctica y retroalimentación',2,'Una actividad formativa permite aplicar la técnica y recibir comentarios para mejorar.','¿Qué evidencia mostraría aprendizaje real?'],
  ['etapa8-abiertos','Nuestro proyecto tiene datos sensibles.','¿Qué significa compartirlos responsablemente?','Revisar consentimiento, privacidad y permisos','Publicar toda información sin revisar','Eliminar las restricciones por comodidad',0,'La ciencia abierta necesita respetar privacidad, consentimiento y normas aplicables.','¿Compartir siempre significa publicar absolutamente todo?'],
  // Candidato SNII ficticio: trazabilidad, no criterios normativos.
  ['etapa9-produccion','Quiero ordenar mis contribuciones académicas.','¿Qué registro facilita la verificación?','Una lista de elogios sin fuentes','Productos, fechas, participaciones y enlaces','Solo contar archivos sin describirlos',1,'La documentación verificable permite entender qué se hizo y quién participó.','¿Cómo corroboraría alguien la contribución?'],
  ['etapa9-impacto','Un proyecto dice haber ayudado a la comunidad.','¿Qué evidencia sería más útil?','Una frase publicitaria','Un número sin contexto','Cambios observados y testimonios con contexto',2,'El impacto se documenta con criterios, observaciones y límites, no solo con afirmaciones.','¿Qué cambió realmente y cómo se sabe?'],
  ['etapa9-expediente','El expediente tiene una actividad sin comprobante.','¿Cómo registro una actividad sin evidencia verificable?','Marco pendiente y busco evidencia verificable','Creo un comprobante inventado','La doy por probada de todos modos',0,'La integridad académica requiere registrar solo información sustentable.','¿Cuál opción permite ser transparente?'],
  ['etapa9-redes','Un grupo externo propone colaborar.','¿Qué acuerdo cuida mejor al equipo?','Asignar tareas sin consultar','Definir metas, responsabilidades y reconocimiento','Dejar la autoría para discutir después',1,'Los acuerdos claros facilitan colaboración justa y trazabilidad de resultados.','¿Qué deberían saber todas las partes?'],
  ['etapa9-mentoria','Una persona novel tiene dudas de investigación.','¿Qué hace una buena mentoría?','Dar órdenes sin escuchar','Resolver todo por ella','Escuchar y ayudarla a elegir su siguiente paso',2,'La mentoría fomenta autonomía, pensamiento crítico y apoyo adecuado.','¿Cómo se acompaña sin sustituir?'],
  ['etapa9-divulgacion','Voy a contar un hallazgo a público no especializado.','¿Qué debo hacer?','Usar ejemplos claros sin exagerar resultados','Usar solo jerga','Omitir incertidumbre para sonar seguro',0,'Divulgar bien significa comunicar con claridad sin deformar lo que se sabe.','¿Qué entendería alguien fuera de tu disciplina?'],
  // SNII I (ficción): mentoría, evaluación y reciprocidad.
  ['etapa10-direccion','El equipo tiene fechas y tareas compartidas.','¿Qué plan ayuda a coordinarlo?','Una lista sin responsables','Hitos, responsables y seguimiento realista','Pedir resultados sin plazos claros',1,'La coordinación efectiva permite detectar retrasos y ajustar expectativas antes de la crisis.','¿Qué necesita saber cada participante?'],
  ['etapa10-arbitraje','Un manuscrito tiene puntos fuertes y débiles.','¿Cómo lo evalúo con integridad?','Según quién lo firmó','Según mis preferencias personales','Con criterios explícitos, evidencia y respeto',2,'La revisión académica debe enfocarse en calidad y argumentos, no en favoritismos.','¿La identidad de autoría sustituye el contenido?'],
  ['etapa10-tesis','Mi estudiante se atascó en el método.','¿Qué acompañamiento favorece su autonomía?','Acordar metas pequeñas y dar comentarios útiles','Escribir la tesis por esa persona','Desaparecer hasta la fecha de entrega',0,'La supervisión oportuna da orientación sin sustituir la autoría del aprendizaje.','¿Cómo ayudas a que la persona avance por sí misma?'],
  ['etapa10-pares','Voy a evaluar una propuesta de alguien conocido.','¿Qué conviene revisar primero?','Si podemos intercambiar favores','Posibles conflictos de interés','Si la propuesta me dará prestigio',1,'La integridad exige identificar conflictos y actuar de acuerdo con procedimientos justos.','¿Algo puede sesgar tu valoración?'],
  ['etapa10-asesoria','Un equipo necesita orientación en un área nueva.','¿Cómo ofrezco ayuda responsablemente?','Prometiendo todo','Ignorando lo que no sé','Aclarando alcance y buscando apoyos pertinentes',2,'Asesorar con honestidad implica reconocer límites y recurrir a especialistas cuando corresponde.','¿Se puede ofrecer ayuda sin saberlo todo?'],
  ['etapa10-extension','Una comunidad propone un problema real.','¿Cómo comienza una colaboración respetuosa?','Escuchar sus necesidades y acordar objetivos','Llegar con una solución impuesta','Publicar resultados sin consultar',0,'La vinculación responsable incorpora la voz y los conocimientos de quienes participan.','¿Quién debería definir el problema junto al equipo?'],
  // SNII II (ficción): red, impacto y liderazgo compartido.
  ['etapa11-red','Una red reúne equipos con métodos distintos.','¿Qué ayuda a trabajar juntos?','Pedir que todos usen mis términos','Acordar objetivos y lenguaje común','Ignorar diferencias culturales',1,'La coordinación interdisciplinaria requiere acuerdos explícitos y escucha entre saberes.','¿Qué necesitan compartir antes de comenzar?'],
  ['etapa11-formacion','El grupo quiere formar a nuevas investigadoras.','¿Qué estrategia deja capacidades duraderas?','Solo repartir certificados','Evitar que hagan preguntas','Practicar métodos y dar mentoría continua',2,'Formar personas implica oportunidades reales de aprendizaje y retroalimentación.','¿Cómo se crea autonomía?'],
  ['etapa11-consolidar','Acumulamos resultados de varios estudios.','¿Cómo construir una línea científica sólida?','Comparar evidencia, límites y nuevas preguntas','Repetir solo conclusiones populares','Ignorar resultados contradictorios',0,'Consolidar conocimiento requiere síntesis crítica y apertura a la revisión.','¿Qué se aprendió entre los distintos estudios?'],
  ['etapa11-evaluar','Un programa tiene muchos productos, pero poco impacto medido.','¿Qué conclusión es prudente?','Éxito definitivo','Revisar objetivos, contexto y evidencia de resultados','Fracaso sin necesidad de análisis',1,'Evaluar no es solo contar productos: es relacionarlos con propósitos y efectos.','¿Qué intentaba conseguir el programa?'],
  ['etapa11-transferir','Una tecnología académica podría beneficiar a un grupo local.','¿Qué debe ocurrir antes de implementarla?','Difundir sin hablar con nadie','Prometer resultados idénticos en todos lados','Consultar necesidades, permisos y riesgos',2,'La transferencia responsable incorpora contexto, consentimiento y evaluación.','¿Quién utilizará la tecnología y bajo qué condiciones?'],
  ['etapa11-congreso','Organizo un simposio científico.','¿Qué práctica favorece el intercambio?','Diversidad de perspectivas y discusión respetuosa','Invitar solo a quienes están de acuerdo','Evitar preguntas al final',0,'La conversación científica se enriquece con preguntas críticas y participación amplia.','¿Qué hace posible aprender de otras personas?'],
  // SNII III (ficción): ciencia abierta, integridad y bien público.
  ['etapa12-estrategia','El consorcio debe elegir prioridades científicas.','¿Qué criterio conviene integrar?','Solo prestigio mediático','Evidencia, necesidades y viabilidad','La moda del mes sin discusión',1,'Las prioridades científicas responsables consideran impacto, conocimiento y recursos.','¿Qué necesita una decisión colectiva justificable?'],
  ['etapa12-consorcio','Equipos de muchas disciplinas colaboran.','¿Qué acuerdo es fundamental?','Que una sola voz decida todo','Que cada equipo ignore al resto','Definir metas, gobernanza y autoría justa',2,'Una colaboración grande necesita reglas claras sobre decisiones, datos y reconocimiento.','¿Cómo evitar conflictos antes de comenzar?'],
  ['etapa12-integridad','Se detecta una inconsistencia en un estudio.','¿Qué respuesta protege la confianza?','Investigarla y corregir con transparencia','Ocultarla para evitar críticas','Culpar a alguien sin revisar',0,'Corregir errores de manera documentada es parte de la integridad científica.','¿Qué mejora más la confianza a largo plazo?'],
  ['etapa12-ciencia_abierta','El proyecto propone liberar su repositorio de datos.','¿Qué debe evaluarse primero?','La cantidad de seguidores','Licencias, privacidad, seguridad y contexto','Si el título resulta atractivo',1,'La apertura responsable exige condiciones legales y éticas además de accesibilidad técnica.','¿Qué información debe mantenerse protegida?'],
  ['etapa12-red_asesoria','Una red pide apoyo para evaluar un plan.','¿Cómo contribuir sin imponer una solución?','Dar una orden inmediata','Descartar las voces locales','Facilitar opciones y explicar evidencia disponible',2,'La asesoría fortalece decisiones cuando ofrece herramientas y reconoce contexto.','¿Quién decide y qué información necesita?'],
  ['etapa12-sintesis','Voy a escribir una obra que reúna años de hallazgos.','¿Qué demuestra una síntesis rigurosa?','Reconocer consensos, desacuerdos y vacíos','Elegir solo estudios favorables','Convertir hipótesis en certezas',0,'Una síntesis crítica muestra lo conocido y las preguntas abiertas.','¿Qué no debería desaparecer de la historia?'],
  // Emérito (ficción): memoria, mentoría y aprendizaje continuo.
  ['etapa13-acompanar','Una joven científica duda de su primera hipótesis.','¿Qué consejo la ayuda más?','«Nunca dudes»','«Pregunta, prueba y pide apoyo»','«No compartas tus ideas»',1,'El acompañamiento valioso transmite curiosidad y confianza para revisar las propias ideas.','¿Qué ayuda a seguir aprendiendo?'],
  ['etapa13-archivo','Encontré notas antiguas de un proyecto colaborativo.','¿Cómo preservo mejor su historia?','Guardo solo las medallas','Elimino los intentos fallidos','Conservo contexto, fechas y contribuciones',2,'Los archivos bien documentados permiten comprender procesos y reconocer a todo el equipo.','¿Qué necesitaría alguien que investigue esa historia?'],
  ['etapa13-memorias','Quiero escribir memorias de mi trayectoria.','¿Qué relato resulta más útil para nuevas generaciones?','Aciertos, errores, contexto y personas que ayudaron','Solo una lista de premios','Una historia sin dudas ni obstáculos',0,'Compartir aprendizajes reales ayuda a otras personas a comprender la investigación como proceso humano.','¿Qué te hubiera gustado saber al comenzar?'],
  ['etapa13-consejo','Me invitan a un consejo científico honorario.','¿Cómo contribuyo con prudencia?','Imponiendo mis ideas por antigüedad','Escuchando evidencia y reconociendo voces nuevas','Evitando explicar mis razones',1,'La experiencia aporta perspectiva, pero no sustituye la evaluación razonada ni la participación.','¿Ser reconocido significa no poder equivocarse?'],
  ['etapa13-mentoria','Alguien quiere repetir un experimento que yo diseñé.','¿Cómo apoyo el aprendizaje?','Pido que repita mis conclusiones','Oculto los materiales','Comparto método, límites y recomendaciones',2,'Una mentoría generosa facilita que otros verifiquen, cuestionen y amplíen conocimiento.','¿Cómo puede aprender alguien de tu experiencia?'],
  ['etapa13-vocaciones','Una niña pregunta «¿puedo ser científica?»','¿Qué respuesta abre más oportunidades?','«Sí: la curiosidad y el aprendizaje son para todas las personas»','«Solo si nunca fallas»','«Solo con muchos premios»',0,'Las vocaciones florecen cuando se fomenta curiosidad, pertenencia y oportunidades de aprender.','¿Qué mensaje invita a intentarlo?'],
];

/** Mapa de búsqueda O(1) para que la UI no tenga que unir textos por título. */
export const LEARNING_CHALLENGES: ReadonlyMap<string, LearningChallenge> = new Map(ROWS.map(([activityId,scene,question,a,b,c,correct,explanation,hint])=>[
  activityId,{activityId,scene,question,options:[a,b,c],correct,explanation,hint}
]));

/** Solo lectura: consultar por ID sin alterar recursos del motor. */
export function challengeForActivity(activityId:string):LearningChallenge|undefined {
  return LEARNING_CHALLENGES.get(activityId);
}

/**
 * Validación de catálogo en desarrollo/tests; útil cuando se añadan actividades.
 * No se invoca desde la interfaz para no penalizar su rendimiento.
 */
export function validateLearningContent():string[] {
 const problems:string[]=[];
 if(LEARNING_STAGES.length!==STAGES.length)problems.push(`Etapas con guía: ${LEARNING_STAGES.length}; esperadas: ${STAGES.length}.`);
 if(ROWS.length!==LEARNING_CHALLENGES.size)problems.push('Hay IDs de retos duplicados.');
 for(const activity of ACTIVITIES){
  const challenge=LEARNING_CHALLENGES.get(activity.id);
  if(!challenge){problems.push(`Falta desafío para ${activity.id}`);continue;}
  if(challenge.options.length!==3||challenge.options.some(text=>!text.trim())||!challenge.question||!challenge.explanation||!challenge.hint)problems.push(`Desafío incompleto: ${activity.id}`);
  if(challenge.correct<0||challenge.correct>2)problems.push(`Respuesta inválida: ${activity.id}`);
 }
 for(const id of LEARNING_CHALLENGES.keys())if(!ACTIVITIES.some(a=>a.id===id))problems.push(`Desafío huérfano: ${id}`);
 return problems;
}
