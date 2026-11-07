/**
 * @module activity-extras
 * Cuatro decisiones pedagógicas ESPECÍFICAS para cada actividad de Primaria
 * hasta SNII Emérito; el primer reto de cada actividad ya vive en learning-path.
 *
 * NO reutilizar preguntas generales entre estaciones. Cada perfil responde a
 * cuatro momentos: preparar, realizar, comprobar y comunicar. El orden es
 * estable porque los índices 0..4 se guardan en las partidas antiguas.
 *
 * Estos ejercicios están diseñados para el juego, no son exámenes oficiales.
 */
import type { Activity } from './stage-activities.js';

/** Evidencias de aprendizaje concretas, en lugar de una pregunta repetida. */
export type ActivityMoments=readonly [prepare:string,perform:string,verify:string,communicate:string];
type ProfileRow=readonly [id:string,prepare:string,perform:string,verify:string,communicate:string];

// Redacción manual: una fila por actividad, con acciones y verificaciones propias.
const PROFILE_ROWS:readonly ProfileRow[]=[
 // Primaria: lectura, matemática, entorno cercano y convivencia.
 ['etapa1-lectura','Elegir un cuento y anticipar de qué tratará','Leer el relato e identificar personajes y sucesos','Revisar si el resumen conserva el inicio, el problema y el final','Narrar con tus palabras la idea principal del cuento'],
 ['etapa1-sumas','Identificar cantidades y qué operación pide el problema','Representar las cantidades con objetos o una suma','Comprobar el resultado contando o haciendo la operación inversa','Explicar qué representan los números y el resultado'],
 ['etapa1-planta','Elegir una planta y acordar cuándo se observará','Medir su altura y anotar fecha y condiciones','Comparar mediciones tomadas con el mismo procedimiento','Mostrar una tabla o dibujo de cómo cambió la planta'],
 ['etapa1-exposicion','Elegir un tema acotado y buscar información confiable','Ordenar tres ideas y ensayar explicarlas con ejemplos','Comprobar que el grupo entienda la idea central','Presentar el tema y responder preguntas con respeto'],
 ['etapa1-intercambio','Establecer reglas claras para compartir libros','Organizar turnos y cuidar los ejemplares prestados','Revisar que todas las personas conozcan los acuerdos','Contar cómo el intercambio benefició al grupo'],
 ['etapa1-mapa','Elegir puntos de referencia y la ruta que se desea mostrar','Dibujar calles, lugares y símbolos comprensibles','Comparar el trayecto dibujado con los lugares reales','Explicar el mapa usando una leyenda y direcciones'],
 // Secundaria: experimentación, argumentación y registro.
 ['etapa2-laboratorio','Plantear una pregunta escolar y revisar condiciones seguras','Cambiar una variable y registrar observaciones','Comparar la prueba con un referente manteniendo otras condiciones','Describir método, datos y limitaciones sin inventar resultados'],
 ['etapa2-ecuaciones','Identificar la incógnita y la igualdad a resolver','Aplicar la misma operación a ambos lados de la ecuación','Sustituir el valor obtenido en la igualdad original','Explicar paso a paso por qué se conserva la igualdad'],
 ['etapa2-debate','Investigar el tema y preparar razones con evidencia','Escuchar las posturas y argumentar sin ataques personales','Contrastar afirmaciones con fuentes comprobables','Resumir acuerdos y desacuerdos respetando otras opiniones'],
 ['etapa2-fuentes','Anotar autor, fecha y procedencia de cada material','Comparar qué afirma cada fuente y qué pruebas ofrece','Corroborar afirmaciones con fuentes independientes','Citar las fuentes consultadas y señalar lo incierto'],
 ['etapa2-club','Acordar qué dificultad desea trabajar cada integrante','Explicar procedimientos y dejar que cada quien intente','Pedir que se resuelva un ejemplo nuevo sin copiar','Compartir estrategias que ayudaron a comprender la tarea'],
 ['etapa2-reporte','Formular la pregunta y planear cómo registrar la práctica','Anotar materiales, procedimiento y observaciones reales','Verificar que los datos sostengan la conclusión propuesta','Escribir un reporte con método, resultados y límites'],
 // Preparatoria técnica: prevención, prototipado, demostración.
 ['etapa3-plan','Definir la necesidad, materiales disponibles y restricciones','Dibujar un esquema con medidas y piezas del prototipo','Revisar si el diseño cumple los requisitos y es seguro','Presentar el plano indicando función y límites de uso'],
 ['etapa3-seguridad','Identificar riesgos y equipo de protección requerido','Seguir instrucciones y usar protección adecuada en el taller','Comprobar que se respetó la lista de seguridad','Comunicar incidentes y medidas preventivas claramente'],
 ['etapa3-bitacora','Preparar una bitácora con campos de fecha y condiciones','Registrar pasos, materiales y cambios observados','Comparar anotaciones para detectar variaciones entre pruebas','Entregar un registro legible que otra persona pueda seguir'],
 ['etapa3-maqueta','Elegir qué aspecto de la maqueta se quiere mejorar','Modificar un elemento de forma controlada y probarlo','Contrastar el resultado nuevo con la prueba anterior','Mostrar la mejora y explicar qué limitaciones conserva'],
 ['etapa3-feria','Preparar el prototipo, una demostración y avisos de seguridad','Exponer el funcionamiento ante visitantes y escuchar preguntas','Comprobar la explicación con una prueba visible y repetible','Comunicar resultados sin prometer capacidades no probadas'],
 ['etapa3-certificar','Revisar las habilidades y los criterios de una práctica simulada','Ejecutar la técnica siguiendo el procedimiento de seguridad','Comparar la ejecución con una lista de criterios observables','Explicar lo aprendido y qué necesita seguir practicando'],
 // Universidad: fundamentos, métodos, bibliografía, pares.
 ['etapa4-seminario','Revisar bibliografía y preguntas que guían la sesión','Comparar argumentos y participar con intervenciones fundamentadas','Contrastar ideas discutidas con la evidencia presentada','Sintetizar acuerdos, críticas y preguntas abiertas'],
 ['etapa4-practica','Leer el protocolo y confirmar supervisión y riesgos','Tomar mediciones y registrar desviaciones de la práctica','Revisar controles e identificar posibles fuentes de error','Entregar resultados reproducibles junto con sus límites'],
 ['etapa4-bibliografia','Definir palabras clave y criterios de búsqueda','Leer fuentes primarias y registrar datos bibliográficos','Comparar calidad y pertinencia de los estudios consultados','Sintetizar hallazgos citando las fuentes correctamente'],
 ['etapa4-integrador','Delimitar el problema y consultar a las personas involucradas','Combinar conocimientos y desarrollar una solución de prueba','Evaluar si la solución responde a los objetivos acordados','Explicar hallazgos, costos, límites y posibles mejoras'],
 ['etapa4-asesoria_pares','Identificar el concepto que el compañero necesita reforzar','Explicar mediante un ejemplo y dejar que la otra persona practique','Pedir que aplique la idea a un ejercicio diferente','Ofrecer retroalimentación clara sin resolverle la tarea'],
 ['etapa4-cartel','Seleccionar pregunta, método y resultados principales','Organizar gráficos legibles y referencias en un cartel','Revisar que figuras y conclusiones reflejen los datos','Presentar el cartel y responder preguntas con evidencia'],
 // Especialidad: simulación, protocolos, supervisión y límites.
 ['etapa5-caso','Reunir antecedentes suficientes y confirmar supervisión','Comparar alternativas de actuación dentro de la simulación','Revisar riesgos, incertidumbres y efectos del caso','Documentar la decisión y sus límites profesionales'],
 ['etapa5-protocolo','Revisar pasos críticos y recursos de la técnica','Ejecutar el protocolo con supervisión y registro','Detectar desviaciones y comprobar controles de calidad','Reportar procedimiento, incidentes y resultados alcanzados'],
 ['etapa5-informe','Definir destinatario, objetivo y alcance del informe','Organizar procedimiento, resultados y evidencias técnicas','Comprobar trazabilidad y coherencia de las conclusiones','Presentar un informe claro con limitaciones explícitas'],
 ['etapa5-discusion','Delimitar el caso y seleccionar fuentes pertinentes','Contrastar enfoques con el grupo de especialistas','Identificar supuestos, riesgos y evidencias faltantes','Resumir acuerdos, diferencias y próximos pasos del caso'],
 ['etapa5-consultoria','Acordar el alcance de la asesoría simulada','Explicar alternativas y supuestos sin fingir certeza','Verificar que la recomendación respete riesgos y contexto','Entregar orientación comprensible y documentar límites'],
 ['etapa5-mejora','Identificar un problema medible de la práctica actual','Diseñar un cambio pequeño y una prueba de seguimiento','Comparar indicadores anteriores y posteriores al cambio','Presentar resultados, riesgos y ajustes recomendados'],
 // Maestría: tesis delimitada, síntesis, métodos y coloquios.
 ['etapa6-pregunta','Precisar población, variables y alcance de la pregunta','Convertir una inquietud en objetivos investigables','Verificar viabilidad, pertinencia y posibilidad de medición','Explicar qué pregunta se responderá y qué quedará fuera'],
 ['etapa6-revision','Definir términos de búsqueda y criterios de inclusión','Comparar críticamente antecedentes metodológicos','Identificar acuerdos, contradicciones y vacíos documentados','Elaborar una síntesis con referencias verificables'],
 ['etapa6-datos','Preparar un plan de análisis y revisar la calidad de datos','Aplicar procedimientos acordes con las variables y supuestos','Revisar valores atípicos y la incertidumbre sin alterarlos','Explicar resultados con figuras y limitaciones metodológicas'],
 ['etapa6-capitulo','Construir un esquema de argumentos y fuentes de apoyo','Redactar métodos, hallazgos e interpretación de forma coherente','Revisar afirmaciones contra datos y citas originales','Entregar un capítulo claro con alcances y bibliografía'],
 ['etapa6-taller','Acordar objetivos y conocimientos previos de participantes','Demostrar una técnica y ofrecer práctica acompañada','Comprobar comprensión con un ejercicio aplicable','Dar retroalimentación y materiales de consulta'],
 ['etapa6-coloquio','Seleccionar avances verificables y dudas pendientes','Presentar pregunta, método y resultados preliminares','Valorar críticas y distinguir límites de la investigación','Comunicar ajustes propuestos tras los comentarios'],
 // Doctorado: originalidad, mediciones, modelos y defensa.
 ['etapa7-diseño','Identificar una contribución original y planear controles','Diseñar experimentos con variables y criterios explícitos','Evaluar potencia, seguridad y sesgos posibles del diseño','Justificar el método y documentar sus límites'],
 ['etapa7-resultados','Definir controles de calidad y repetición de mediciones','Registrar resultados y metadatos sin alterar observaciones','Verificar consistencia con réplicas y análisis independientes','Presentar resultados incluso si contradicen la hipótesis'],
 ['etapa7-modelo','Elegir supuestos, variables y datos adecuados al modelo','Implementar un análisis con validación diferenciada','Evaluar error, sensibilidad y capacidad de generalización','Explicar predicciones junto con incertidumbre y supuestos'],
 ['etapa7-articulo','Definir aportación, revista objetivo y estructura del texto','Redactar métodos y resultados reproducibles','Revisar coherencia entre datos, figuras y conclusiones','Presentar hallazgos y responder revisiones con transparencia'],
 ['etapa7-seminario','Definir nivel de audiencia y preguntas del seminario','Explicar metodología avanzada con ejemplos y debate','Evaluar comprensión con preguntas y ejercicios','Compartir referencias y límites de los métodos enseñados'],
 ['etapa7-defensa','Organizar evidencia, aportación original y limitaciones','Argumentar decisiones metodológicas ante el comité','Responder objeciones con datos y reconocer incertidumbres','Sintetizar ajustes que fortalecerán la tesis'],
 // Posdoctorado: autonomía, reproducibilidad, redes y apertura.
 ['etapa8-linea','Seleccionar problemas relevantes y recursos realistas','Plantear estudios conectados que abran preguntas propias','Comprobar viabilidad y contribución diferencial del plan','Presentar una agenda con hitos y colaboraciones posibles'],
 ['etapa8-replicar','Reunir protocolo, materiales y condiciones reportadas','Reproducir el procedimiento registrando divergencias','Comparar resultados obtenidos y posibles fuentes de diferencia','Publicar una comparación transparente y sus limitaciones'],
 ['etapa8-codirigir','Acordar responsabilidades, plazos y reconocimiento de aportes','Coordinar tareas y decisiones con los equipos asociados','Revisar avances y resolver desacuerdos con evidencias','Compartir un reporte de contribuciones y siguientes pasos'],
 ['etapa8-propuesta','Definir objetivos, presupuesto y criterios de evaluación','Describir actividades, responsables y cronograma viable','Revisar costos, riesgos y métricas antes de presentar','Entregar una propuesta justificando beneficios y límites'],
 ['etapa8-formacion','Determinar necesidades formativas y nivel de las personas','Enseñar una técnica avanzada con práctica supervisada','Comprobar ejecución segura y comprensión del procedimiento','Entregar guías y explicar posibles errores frecuentes'],
 ['etapa8-abiertos','Revisar privacidad, permisos, formatos y licencias','Preparar datos y metadatos aptos para reutilización','Verificar anonimización cuando corresponda y reproducibilidad','Publicar instrucciones de acceso y límites de uso'],
 // Candidato: evidencias, comunidades, expediente ficticio.
 ['etapa9-produccion','Definir una lista verificable de productos académicos','Organizar productos por fecha, autoría y contribución','Revisar correspondencia entre registro y evidencia original','Describir la trayectoria sin inflar ni inventar resultados'],
 ['etapa9-impacto','Acordar objetivos e indicadores con la comunidad','Registrar actividades, participantes y cambios observados','Distinguir resultados medidos de expectativas no comprobadas','Compartir un reporte accesible y reconocer aportaciones'],
 ['etapa9-expediente','Reunir constancias y datos de una trayectoria simulada','Clasificar evidencias y registrar procedencia de cada documento','Detectar duplicados y marcar lo que falta por comprobar','Presentar expediente ficticio con criterios transparentes'],
 ['etapa9-redes','Identificar intereses compartidos y reglas de colaboración','Acordar tareas, datos y reconocimiento con otra institución','Revisar si se cumplen los compromisos y permisos pactados','Difundir resultados reconociendo a todos los participantes'],
 ['etapa9-mentoria','Conocer metas, dificultades y autonomía de la persona orientada','Sugerir estrategias de aprendizaje sin hacer su trabajo','Evaluar avances según objetivos que ambas partes acordaron','Ofrecer retroalimentación respetuosa y oportunidades de mejora'],
 ['etapa9-divulgacion','Definir público, necesidades e ideas clave de la charla','Usar ejemplos cotidianos y lenguaje accesible','Comprobar comprensión mediante diálogo y preguntas','Compartir hallazgos sin exagerar conclusiones científicas'],
 // Nivel I: dirección responsable y evaluación de pares.
 ['etapa10-direccion','Definir entregables, recursos y responsabilidades del equipo','Coordinar tareas y resolver impedimentos con comunicación','Verificar resultados, riesgos y cumplimiento de objetivos','Documentar decisiones y reconocer aportaciones reales'],
 ['etapa10-arbitraje','Leer manuscrito y declarar cualquier conflicto de interés','Examinar método, datos y conclusiones con criterios claros','Comprobar que las observaciones sean justificadas y respetuosas','Entregar un dictamen confidencial y constructivo'],
 ['etapa10-tesis','Acordar objetivos, calendario y autonomía de la persona tesista','Orientar preguntas y ofrecer comentarios sin sustituir autoría','Evaluar avances contra criterios académicos claros','Comunicar sugerencias concretas y reconocer logros'],
 ['etapa10-pares','Revisar criterios y declarar vínculos con los equipos evaluados','Contrastar propuestas con objetivos, viabilidad y evidencia','Detectar sesgos y documentar justificaciones de la evaluación','Devolver retroalimentación transparente y respetuosa'],
 ['etapa10-asesoria','Escuchar la necesidad y acordar el alcance del acompañamiento','Presentar alternativas con supuestos y referencias','Revisar compatibilidad con contexto, ética y recursos','Entregar recomendaciones claras sin prometer certeza'],
 ['etapa10-extension','Dialogar con la comunidad para definir necesidades reales','Desarrollar una intervención participativa y responsable','Medir resultados con indicadores acordados localmente','Devolver los aprendizajes a quienes participaron'],
 // Nivel II: redes, programas, transferencia.
 ['etapa11-red','Acordar objetivos y gobernanza entre las instituciones','Coordinar agendas, recursos y contribuciones diversas','Revisar que los acuerdos protejan datos y autoría','Comunicar avances y reconocer equipos participantes'],
 ['etapa11-formacion','Identificar necesidades de nuevas personas investigadoras','Diseñar mentorías con metas y práctica progresiva','Evaluar competencias adquiridas sin atribuir trabajos ajenos','Compartir oportunidades, recursos y aprendizajes éticos'],
 ['etapa11-consolidar','Delimitar preguntas que profundizan resultados previos','Conectar estudios mediante métodos y evidencias comparables','Examinar la solidez y límites de la evidencia acumulada','Sintetizar aportaciones de la línea sin ocultar contradicciones'],
 ['etapa11-evaluar','Definir objetivos, indicadores y condiciones del programa','Revisar evidencia de resultados y efectos no previstos','Comparar efectos reales con metas y recursos utilizados','Presentar mejoras justificadas y límites de la evaluación'],
 ['etapa11-transferir','Identificar necesidades, derechos y permisos de uso','Adaptar resultados a condiciones y capacidades locales','Evaluar riesgos, utilidad y sostenibilidad de la adopción','Acordar responsabilidades e informar qué se puede transferir'],
 ['etapa11-congreso','Definir temas, invitados y criterios de participación','Organizar sesiones con intercambio y moderación respetuosa','Revisar accesibilidad, conflictos y diversidad de perspectivas','Publicar memorias con permisos y reconocimiento correctos'],
 // Nivel III: consorcios, políticas, síntesis.
 ['etapa12-estrategia','Priorizar problemas con evidencia y consulta interdisciplinaria','Definir recursos, responsables y objetivos estratégicos','Evaluar impacto potencial, riesgos y oportunidad de ajustes','Explicar decisiones y criterios ante la comunidad científica'],
 ['etapa12-consorcio','Establecer acuerdos de gobernanza, datos y autoría','Coordinar equipos y métodos de disciplinas diferentes','Verificar compromisos, recursos y rendición de cuentas','Compartir avances y límites entre las instituciones'],
 ['etapa12-integridad','Identificar riesgos éticos y obligaciones de transparencia','Proponer procesos de declaración, revisión y corrección','Comprobar que existan canales confiables para reportar problemas','Difundir políticas comprensibles y capacitar al equipo'],
 ['etapa12-ciencia_abierta','Revisar licencias, privacidad e infraestructura disponible','Preparar materiales reutilizables con metadatos adecuados','Probar acceso y reproducibilidad sin divulgar información privada','Publicar guías de reutilización y restricciones explícitas'],
 ['etapa12-red_asesoria','Escuchar necesidades y capacidades de cada red','Acompañar planes colaborativos y formación de personas','Revisar resultados con indicadores acordados por la red','Compartir recomendaciones sin imponer una sola disciplina'],
 ['etapa12-sintesis','Definir alcance y criterios de inclusión de la obra','Integrar hallazgos de múltiples estudios y tradiciones','Contrastar afirmaciones con evidencia y contradicciones','Publicar una síntesis crítica con fuentes y limitaciones'],
 // Emérito: mentoría, memoria, participación responsable.
 ['etapa13-acompanar','Escuchar metas e intereses de las nuevas generaciones','Guiar decisiones manteniendo la autonomía de quienes aprenden','Observar avances y ajustar la mentoría con consentimiento','Transmitir experiencias, incluidos errores y aprendizajes'],
 ['etapa13-archivo','Definir criterios de conservación, privacidad y acceso','Catalogar documentos con fechas y autorías verificables','Revisar integridad de los materiales y respaldos','Explicar el contexto histórico y reconocer colaboraciones'],
 ['etapa13-memorias','Planear una narración que incluya personas y contextos','Redactar experiencias mostrando aciertos y equivocaciones','Contrastar recuerdos con documentos y voces participantes','Publicar memorias honestas que inspiren nuevas preguntas'],
 ['etapa13-consejo','Revisar temas, evidencia y límites de la función honoraria','Participar escuchando perspectivas y deliberando con respeto','Declarar conflictos y valorar consecuencias de las decisiones','Emitir recomendaciones transparentes sin imponer autoridad'],
 ['etapa13-mentoria','Conocer desafíos de la persona mentorada y acordar metas','Compartir criterios sin sustituir su juicio profesional','Evaluar si la orientación fomenta mayor independencia','Ofrecer consejos con ejemplos, dudas y aprendizajes personales'],
 ['etapa13-vocaciones','Definir público escolar y preguntas que despierten curiosidad','Organizar experiencias seguras de ciencia participativa','Comprobar lo aprendido con diálogo y observación','Invitar a seguir explorando y compartir fuentes accesibles'],
];

export const ACTIVITY_MOMENTS:Readonly<Record<string,ActivityMoments>>=Object.fromEntries(
 PROFILE_ROWS.map(([id,prepare,perform,verify,communicate])=>[id,[prepare,perform,verify,communicate]])
);

/**
 * Produce cuatro retos contextuales con soluciones de fases distintas.
 * Los distractores son acciones posibles en otra fase, pero NO responden a la
 * fase solicitada. Evita elegir al azar preguntas de otra actividad/etapa.
 */
/**
 * Seis maneras de formular cada una de cuatro fases. Los perfiles de
 * actividad siguen siendo únicos: estas frases no sustituyen el contenido.
 */
const QUESTION_VARIANTS:readonly (readonly (readonly string[])[])[]=[
 [
  [
   "¿Qué conviene organizar primero?",
   "¿Con qué decisión debería comenzar?",
   "¿Cuál es un buen punto de partida?",
   "¿Qué preparativo da claridad a la tarea?",
   "Antes de practicar, ¿qué debería tener listo?",
   "¿Qué ayuda a iniciar con orden?"
  ],
  [
   "¿Qué debería hacer durante la práctica?",
   "¿Cuál es la acción principal ahora?",
   "¿Qué paso corresponde a la ejecución?",
   "¿Cómo pasaría de la idea a la acción?",
   "¿Qué haría la mascota en este momento?",
   "¿Qué actividad pone a prueba el plan?"
  ],
  [
   "¿Qué permitiría verificar lo ocurrido?",
   "¿Cómo se puede revisar el resultado?",
   "¿Con qué acción se comprueba lo aprendido?",
   "¿Cómo detectarías un posible error?",
   "¿Qué corresponde a la fase de revisión?",
   "¿Qué haría falta para contrastar los hallazgos?"
  ],
  [
   "¿Qué compartiría al finalizar?",
   "¿Cómo explicaría el proceso a su grupo?",
   "¿Qué puede comunicar con claridad?",
   "¿Cómo haría llegar los hallazgos a otros?",
   "¿Qué acción permite contar lo aprendido?",
   "¿Cuál sería el mejor cierre explicativo?"
  ]
 ],
 [
  [
   "Antes de resolver el reto, ¿qué debe elegir?",
   "¿Qué se revisa antes del primer intento?",
   "¿Cuál es la mejor preparación?",
   "¿Qué organizaría para trabajar con cuidado?",
   "¿Cómo conviene iniciar esta investigación?",
   "¿Qué paso pertenece a la planeación?"
  ],
  [
   "¿Qué haría para desarrollar la actividad?",
   "¿Cuál de estas acciones supone practicar?",
   "¿Qué opción permite poner en marcha el trabajo?",
   "¿Cómo llevaría adelante la actividad?",
   "¿Qué sucede durante el ejercicio?",
   "¿Qué acción ejecuta el plan?"
  ],
  [
   "¿Qué evidencia conviene revisar ahora?",
   "¿Cómo comprobaría que funcionó?",
   "¿Qué permite comparar el resultado con el objetivo?",
   "¿Qué paso corresponde a verificar?",
   "¿Cómo reconocería una conclusión apresurada?",
   "¿Qué revisión necesita el trabajo?"
  ],
  [
   "¿Cómo presentaría el aprendizaje?",
   "¿Qué contaría al terminar?",
   "¿Qué información compartiría con otras personas?",
   "¿Cómo explicaría su hallazgo?",
   "¿Qué opción comunica el resultado?",
   "¿Qué entrega permitiría comprender el trabajo?"
  ]
 ]
];

/** Genera las preguntas 2–5 con orden de soluciones variado y estable. */
export function activityContextSteps(activity:Activity):readonly {
 scene:string;question:string;options:readonly [string,string,string];correct:0|1|2;explanation:string;hint:string;
}[] {
 const moments=ACTIVITY_MOMENTS[activity.id];
 if(!moments)return [];
 const [prepare,perform,verify,communicate]=moments;
 const seed=Array.from(activity.id).reduce((sum,ch)=>sum+ch.charCodeAt(0),0);
 const variant=QUESTION_VARIANTS[activity.minStage%QUESTION_VARIANTS.length];
 const phraseIndex=(seed+(activity.id.split('-').at(-1)?.length??0))%6;
 const suffixes=[` para «${activity.label}»?`,` en «${activity.label}»?`,` en «${activity.label}»?`,` sobre «${activity.label}»?`];
 const ask=(phase:number)=>variant[phase][phraseIndex].replace(/\?$/,suffixes[phase]);
 // No se modifica el paso persistido (0..4). La rotación fija hace que las
 // soluciones no aparezcan siempre en la misma letra a lo largo de la aventura.
 const rotate=(options:readonly [string,string,string],correct:0|1|2,phase:number)=>{
  const shift=(seed+[2,1,0,2][phase])%3;
  return {options:[options[(3-shift)%3],options[(4-shift)%3],options[(5-shift)%3]] as [string,string,string],correct:((correct+shift)%3) as 0|1|2};
 };
 const steps=[
  {scene:activity.flavor,question:ask(0),answers:[perform,prepare,communicate] as [string,string,string],correct:1 as const,explanation:prepare,hint:'Antes de empezar, piensa en lo que hará posible una práctica bien organizada.'},
  {scene:`${activity.icon} La mascota pone en práctica lo que preparó.`,question:ask(1),answers:[perform,verify,prepare] as [string,string,string],correct:0 as const,explanation:perform,hint:'Distingue una acción que se ejecuta de otra que solo sirve para planear.'},
  {scene:'Llegó el momento de revisar los resultados obtenidos.',question:ask(2),answers:[communicate,perform,verify] as [string,string,string],correct:2 as const,explanation:verify,hint:'Lo que parece funcionar aún puede necesitar una comprobación.'},
  {scene:'El equipo quiere conocer los aprendizajes de la mascota.',question:ask(3),answers:[prepare,communicate,verify] as [string,string,string],correct:1 as const,explanation:communicate,hint:'Imagina qué necesita entender alguien que no participó.'}
 ];
 return steps.map((step,i)=>({...step,...rotate(step.answers,step.correct,i),explanation:`${step.explanation}.`}));
}
