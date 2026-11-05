/**
 * @module data/learning-sequences
 * Banco de misiones de aprendizaje por actividad.
 *
 * Cada aventura se compone de cinco pasos: el desafío propio de v0.7 y
 * cuatro ejercicios complementarios. Kínder dispone de cuatro ejercicios
 * ADICIONALES y propios de cada actividad; en las etapas restantes se usan
 * bancos transversales de la etapa (pueden reaparecer en otra asignatura).
 *
 * IMPORTANTE: esta biblioteca solo presenta conocimientos; acertar NO concede
 * PA, CR ni UPE. El motor registra aciertos y otorga recompensas al PRACTICAR.
 * Preguntas y claves son contenido educativo, no requisitos oficiales SNII.
 */
import { ACTIVITIES, STAGES } from './catalog.js';
import { challengeForActivity } from './learning-path.js';
import type { LearningChallenge } from './learning-path.js';

/** Paso identificado por índice estable: los índices persisten en IndexedDB. */
export interface LearningStep extends LearningChallenge { stepIndex:number; }
type Extra = readonly [scene:string,question:string,a:string,b:string,c:string,correct:0|1|2,explanation:string,hint:string];
const q=(scene:string,question:string,options:readonly [string,string,string],correct:0|1|2,explanation:string,hint:string):Extra=>[scene,question,...options,correct,explanation,hint];

/** Kínder: 24 preguntas adicionales específicas, sin repetir el reto inicial. */
const KINDER:Readonly<Record<string,readonly Extra[]>>={
 'etapa0-colores':[
  q('Hay fichas rojas, amarillas y azules.','¿Qué fichas tienen el mismo color?',['Una roja y una azul','Dos rojas','Una amarilla y una azul'],1,'Agrupar por color permite reconocer semejanzas aunque cambie la forma.','Mira el color, no el tamaño.'),
  q('Vamos a guardar las figuras en cajas.','¿Cuál figura tiene tres lados?',['Triángulo','Cuadrado','Círculo'],0,'Un triángulo tiene tres lados y tres vértices.','Cuenta los lados con un dedo.'),
  q('La docente muestra una rueda de bicicleta.','¿A qué figura se parece su contorno?',['Rectángulo','Triángulo','Círculo'],2,'La rueda tiene un contorno circular; las figuras también están en los objetos cotidianos.','¿Qué figura no tiene esquinas?'),
  q('Hay dos estrellas: una pequeña y otra grande.','¿Qué podemos decir de ellas?',['Son de colores distintos necesariamente','Tienen la misma forma aunque cambie el tamaño','La grande es un círculo'],1,'La forma puede mantenerse aunque los objetos sean de diferentes tamaños.','Compara el contorno de ambas.')],
 'etapa0-bloques':[
  q('Tenemos piezas anchas y estrechas.','¿Cuál es mejor para construir una base estable?',['Una pieza ancha','Una pieza muy pequeña sobre una punta','Una pieza que ruede'],0,'Una base ancha y firme suele sostener mejor una estructura de bloques.','¿Sobre qué se apoyarían las demás piezas?'),
  q('La torre se inclina hacia la derecha.','¿Qué conviene hacer primero?',['Agregar más piezas a la derecha','Observar y acomodar la base','Sacudir la torre'],1,'Revisar la base permite corregir la distribución del peso.','¿Qué parte sostiene la construcción?'),
  q('La torre cayó, pero nadie se lastimó.','¿Qué aprendemos al intentarlo otra vez?',['Que construir es imposible','Que ya no debemos jugar','Que podemos cambiar el diseño y probar'],2,'Probar, observar y modificar ayuda a descubrir cómo funciona el equilibrio.','Los intentos enseñan algo.'),
  q('Dos bloques iguales se apoyan sobre una mesa.','¿Qué mantiene la torre más equilibrada?',['Ponerlos centrados uno sobre otro','Colocar uno casi fuera del borde','Empujar la mesa'],0,'Alinear los bloques ayuda a distribuir su peso sobre el soporte.','Piensa dónde cae el peso.')],
 'etapa0-semillas':[
  q('Una semilla está en una maceta con tierra seca.','¿Qué cuidado básico necesita para comenzar a crecer?',['Luz de una linterna toda la noche','Agua en cantidad adecuada','Pintura brillante'],1,'El agua permite iniciar procesos necesarios para la germinación, sin encharcar.','¿Qué necesita la mayoría de las plantas para vivir?'),
  q('Una planta tiene hojas nuevas.','¿Qué conviene hacer para conocer su crecimiento?',['Arrancar una hoja cada día','Cambiar de maceta cada hora','Observar y dibujar sus cambios'],2,'Registrar observaciones permite comparar cómo cambia con el tiempo.','Una bitácora puede usar dibujos.'),
  q('Dos semillas iguales reciben diferente agua.','¿Qué haría más justa la comparación?',['Mantener igual la luz y el tipo de tierra','Cambiar también la temperatura y maceta','Usar especies distintas'],0,'Cambiar una condición y mantener otras facilita comparar resultados.','¿Qué tendría que ser igual entre las macetas?'),
  q('La semilla todavía no brota.','¿Qué actitud ayuda a investigar?',['Inventar que ya nació','Esperar, cuidar y volver a observar','Tirarla de inmediato'],1,'Los seres vivos tienen ritmos distintos; observar con paciencia da información.','El crecimiento toma tiempo.')],
 'etapa0-cuento':[
  q('El cuento tiene inicio, problema y final.','¿Qué sucede normalmente al comienzo?',['Conocemos a los personajes','Aparecen los créditos finales','Se explica la moraleja antes de leer'],0,'El inicio presenta el mundo y a los personajes de la historia.','¿Cómo sabríamos de quién trata?'),
  q('La protagonista está triste porque perdió su juguete.','¿Qué podríamos preguntarle?',['Si siempre ganará','Cómo se siente y qué necesita','Si sabe multiplicar'],1,'Preguntar por emociones ayuda a comprender a los personajes y a las personas.','Escucha su sentimiento.'),
  q('Vemos la ilustración de una nube negra.','¿Cómo debemos interpretar lo que va a pasar?',['Seguro nevará','La historia ya terminó','Podemos imaginar y después leer para comprobar'],2,'Las ilustraciones permiten hacer predicciones que contrastamos con el texto.','¿Adivinar es lo mismo que saber?'),
  q('Contamos el cuento a una amistad.','¿Qué ayuda a que nos entienda?',['Decir qué ocurrió primero y después','Contar solo el final','Cambiar de personaje en cada oración'],0,'Ordenar los sucesos da claridad a una narración.','Piensa en la secuencia.')],
 'etapa0-compartir':[
  q('Dos mascotas quieren el mismo juego.','¿Qué opción cuida la convivencia?',['Arrebatarlo','Acordar turnos','Esconderlo para siempre'],1,'Turnarse permite que ambas participen con respeto.','¿Cómo podrían jugar las dos?'),
  q('Una amiga se quedó sin piezas.','¿Qué gesto demuestra empatía?',['Ignorarla','Reírse','Preguntar si necesita ayuda'],2,'Escuchar las necesidades de los demás es parte de la convivencia.','¿Cómo te gustaría que te trataran?'),
  q('Se rompe un material compartido por accidente.','¿Qué conviene hacer?',['Avisar y pedir ayuda para repararlo','Culpar a otra persona','Esconder lo ocurrido'],0,'Reconocer errores ayuda a buscar soluciones y cuidar los materiales.','Ser sincero ayuda a resolver problemas.'),
  q('La clase recoge después de jugar.','¿Qué demuestra responsabilidad compartida?',['Que solo una persona limpie','Colaborar cada quien con una tarea','Dejarlo todo tirado'],1,'Cuidar espacios comunes es una responsabilidad compartida.','Piensa en lo que beneficia al grupo.')],
 'etapa0-dibujar':[
  q('Observamos una mariposa de muchos colores.','¿Qué ayuda a recordar sus detalles?',['Dibujar formas y colores observados','Inventar que es un pez','Cerrar los ojos y adivinar'],0,'El dibujo de observación permite registrar características visibles.','Primero mira con atención.'),
  q('Tu dibujo es diferente al de tu compañero.','¿Qué es más importante al expresarse?',['Que todos dibujen igual','Que puedas contar lo que observaste','Que nadie haga preguntas'],1,'El dibujo comunica observaciones e ideas; no hay una única forma válida de expresarse.','Cada persona observa detalles distintos.'),
  q('Dibujaste una flor sin tallo.','¿Qué puedes hacer si quieres mejorar el registro?',['Borrar toda la libreta','Decir que no importa observar','Mirar de nuevo y añadir lo que falta'],2,'Volver a observar permite completar y mejorar registros.','Un dibujo también se puede revisar.'),
  q('Quieres mostrar que una planta creció.','¿Qué dibujos ayudarían a compararla?',['Uno de antes y otro de después','Dos dibujos iguales sin fecha','Solo el color de la maceta'],0,'Comparar imágenes en momentos distintos permite observar cambios.','Piensa en el paso del tiempo.')]
};

/**
 * Retos transversales de etapa. Se utilizan en las seis actividades de dicha
 * etapa para relacionar contenidos; los siguientes paquetes ampliarán cada
 * área temática con retos individuales, sin invalidar índices guardados.
 */
const STAGE_BANK:readonly (readonly Extra[])[]=[
 [],
 [
 q('La mascota leyó un párrafo sobre el agua.','¿Cómo sabe cuál fue la idea principal?',['Cuenta las letras','Explica de qué trató el texto','Solo repite la primera palabra'],1,'Resumir consiste en comunicar las ideas importantes con palabras propias.','¿Cuál fue el tema común?'),
 q('En el huerto hay 3 filas de 4 plantas.','¿Cuántas plantas hay en total?',['12 plantas','7 plantas','10 plantas'],0,'Tres grupos de cuatro son 4 + 4 + 4 = 12.','Cuenta grupos iguales.'),
 q('Dos fuentes describen un animal.','¿Qué haces si dicen cosas diferentes?',['Elegir la más bonita','Copiar ambas sin leer','Comparar y buscar información confiable'],2,'Contrastar fuentes permite resolver dudas y detectar errores.','No todo lo impreso es necesariamente correcto.'),
 q('Vas a explicar un experimento escolar.','¿Qué orden ayuda a comprenderlo?',['Conclusión sin datos','Pregunta, procedimiento y observaciones','Solo dibujos de decoración'],1,'Un relato claro permite que otras personas comprendan cómo se obtuvo el resultado.','Piensa cómo lo contarías a otra clase.')],
 [
 q('El equipo compara dos noticias sobre el mismo hecho.','¿Qué aporta más confianza?',['Fecha, autor y fuentes comprobables','Muchas letras mayúsculas','Un titular emocionante'],0,'Verificar autoría, fecha y evidencia ayuda a evaluar información.','Busca de dónde salieron los datos.'),
 q('La mascota plantea una hipótesis.','¿Qué debería poder hacerse con ella?',['Votarla sin estudiar','Ponerla a prueba con observaciones','Declararla cierta de antemano'],1,'Una hipótesis científica se contrasta con evidencia.','No es necesario que siempre se confirme.'),
 q('En un debate aparece una opinión opuesta.','¿Qué respuesta ayuda a aprender?',['Interrumpir','Burlarse','Escuchar y pedir argumentos'],2,'Considerar argumentos y evidencia fortalece la discusión crítica.','Las personas pueden disentir respetuosamente.'),
 q('Se reporta que una planta creció.','¿Qué dato serviría para comprobarlo?',['Altura medida en fechas distintas','Una opinión sobre el color','Solo un adjetivo'],0,'Mediciones comparables permiten evaluar cambios.','¿Qué podrías medir?')],
 [
 q('Vamos a preparar un prototipo escolar.','¿Qué debe definirse antes de construir?',['Solo su color','Problema, materiales y función','La cantidad de fotos'],1,'Un proyecto técnico parte de un problema y criterios verificables.','Pregúntate para qué servirá.'),
 q('La máquina de prueba presenta una falla.','¿Qué procede primero?',['Detener y revisar la seguridad','Forzarla hasta que funcione','Ocultar la falla'],0,'Detenerse y evaluar riesgos protege a las personas y al equipo.','La seguridad va antes que la velocidad.'),
 q('Hay tres diseños posibles.','¿Cómo elegir responsablemente?',['Por el nombre más bonito','Sin hacer pruebas','Comparando criterios y resultados'],2,'Las decisiones técnicas se justifican con requisitos y pruebas.','¿Qué evidencia funcionaría?'),
 q('La bitácora registra un intento fallido.','¿Por qué conservarlo?',['Para culpar a alguien','Para aprender qué cambió y corregir','Porque nunca se revisará'],1,'Los intentos fallidos aportan información para mejorar diseños.','Los errores enseñan si están documentados.')],
 [
 q('Una investigación universitaria empieza con una duda.','¿Qué ayuda a delimitarla?',['Definir población, problema y alcance','Buscar una respuesta que guste','Eliminar objetivos'],0,'Acotar una pregunta hace viable la investigación.','¿Qué puedes estudiar realmente?'),
 q('Encuentras un dato sin fuente.','¿Cuál es el siguiente paso académico?',['Citarlo como seguro','Verificar su origen y contexto','Multiplicarlo por dos'],1,'La trazabilidad permite evaluar la información.','¿Quién lo produjo y cómo?'),
 q('Dos integrantes colaboraron en el proyecto.','¿Cómo reconocer sus aportes?',['Ignorar a uno','Inventar créditos','Documentar contribuciones reales'],2,'Reconocer el trabajo evita atribuciones injustas.','La autoría no se asigna por amistad.'),
 q('Un resultado inesperado aparece en una práctica.','¿Qué actitud ayuda?',['Revisar método y registrar el hallazgo','Borrarlo sin explicación','Ajustarlo para confirmar la idea'],0,'Los resultados inesperados también son información valiosa.','La ciencia investiga incluso lo sorprendente.')],
 [
 q('Un caso profesional tiene información insuficiente.','¿Qué decisión es más prudente?',['Actuar por intuición','Pedir información y supervisión','Ocultar la incertidumbre'],1,'Reconocer límites reduce errores de práctica.','Saber cuándo consultar es parte del aprendizaje.'),
 q('Vas a aplicar un procedimiento delicado.','¿Qué revisas antes?',['Protocolos, riesgos y recursos','Quién tiene más seguidores','El color del formato'],0,'La práctica responsable requiere preparación y seguridad.','¿Qué protege a las personas involucradas?'),
 q('Un informe menciona una excepción.','¿Cómo debe documentarse?',['Omitirla','Modificar los registros','Explicar qué sucedió y sus límites'],2,'Registrar excepciones protege la integridad del informe.','No ocultes lo que cambia la interpretación.'),
 q('Dos enfoques profesionales dan resultados distintos.','¿Qué facilita decidir?',['Elegir por prestigio','Comparar evidencia y condiciones','Ignorar las diferencias'],1,'La elección debe responder al contexto y a los datos disponibles.','¿Por qué funcionó cada uno?')],
 [
 q('La pregunta de tesis es demasiado amplia.','¿Qué cambio la vuelve investigable?',['Delimitar variables y población','Añadir temas sin límite','Quitar el método'],0,'Una investigación viable necesita objetivos acotados.','¿Qué se puede medir?'),
 q('Dos estudios parecen contradictorios.','¿Qué debes comparar primero?',['Sus portadas','Métodos, muestras y contexto','Su número de páginas solamente'],1,'Diferencias metodológicas pueden explicar resultados distintos.','¿Estudiaban las mismas condiciones?'),
 q('Una gráfica indica asociación entre variables.','¿Qué NO puedes afirmar solo por eso?',['Que hay un patrón','Que hace falta estudiar causas','Que una variable causa la otra necesariamente'],2,'Correlación no demuestra causalidad por sí sola.','Una asociación puede tener otras explicaciones.'),
 q('Llega una crítica al protocolo de tesis.','¿Cuál es una respuesta productiva?',['Revisarla y ajustar si procede','Descartarla por incomodidad','Afirmar que nunca hay sesgos'],0,'La revisión fortalece la calidad metodológica.','Una crítica no equivale a un fracaso.')],
 [
 q('Tu experimento necesita comparar tratamientos.','¿Qué aporta un control bien elegido?',['Garantizar la hipótesis','Un punto de referencia para interpretar efectos','Eliminar todos los errores'],1,'Los controles ayudan a separar efectos de otras variables.','¿Contra qué compararías?'),
 q('El análisis da un resultado inesperado.','¿Qué protege la integridad científica?',['Registrar y evaluar los datos sin alterarlos','Cambiar valores para encajar','Ocultar resultados negativos'],0,'Registrar hallazgos es más importante que confirmar expectativas.','Los resultados negativos pueden ser útiles.'),
 q('Quieres mostrar que un modelo generaliza.','¿Qué prueba resulta más informativa?',['Solo entrenarlo más','Elegir el ejemplo que mejor sale','Evaluarlo con datos independientes'],2,'Los datos externos al entrenamiento ayudan a medir generalización.','¿Funciona fuera de los casos conocidos?'),
 q('Tu comité pregunta por una limitación de tesis.','¿Cómo responder con rigor?',['Evadir la pregunta','Reconocerla y explicar su alcance','Inventar observaciones'],1,'La defensa académica requiere honestidad sobre límites y evidencia.','No es necesario pretender infalibilidad.')],
 [
 q('Quieres iniciar una línea independiente.','¿Qué criterio ayuda a elegir el primer estudio?',['Viabilidad y relevancia de la pregunta','Popularidad en redes solamente','Promesa de éxito garantizado'],0,'La autonomía exige evaluar objetivos, recursos y posibilidades.','¿Qué podrías terminar responsablemente?'),
 q('Un equipo propone compartir datos.','¿Qué condición debe revisarse?',['El color del gráfico','Privacidad, permisos y consentimiento','La cantidad de titulares'],1,'La ciencia abierta debe respetar derechos y seguridad de las personas.','Compartir no significa publicar todo.'),
 q('Varios laboratorios colaborarán.','¿Qué acuerdo reduce conflictos?',['Dejar roles indefinidos','Asignar méritos sin revisar','Precisar responsabilidades y reconocimiento'],2,'Los acuerdos tempranos facilitan una colaboración justa.','Piensa en cómo se acreditará cada aporte.'),
 q('Vas a reproducir un resultado.','¿Qué necesitas conocer?',['Procedimiento y condiciones originales','Solo el título','Solo la conclusión del resumen'],0,'La reproducibilidad requiere métodos suficientemente descritos.','¿Qué debe mantenerse comparable?')],
 [
 q('Preparas un expediente ficticio de trayectoria.','¿Qué fortalece su verificabilidad?',['Una frase publicitaria','Fechas, productos y evidencias trazables','Solo fotografías'],1,'La trazabilidad muestra qué se hizo y cómo puede comprobarse.','La evidencia debe poder revisarse.'),
 q('El impacto social fue declarado por un equipo.','¿Qué permite evaluarlo?',['Cambios observables y contexto','Cantidad de adjetivos','Prestigio de la institución'],0,'El impacto se examina con objetivos e indicadores apropiados.','¿Qué cambió realmente?'),
 q('Ves una contribución sin soporte documental.','¿Qué haces?',['Inventar una constancia','Afirmar que está probada','Marcarla pendiente y buscar pruebas'],2,'La honestidad del expediente importa más que su apariencia.','No declares como verificado lo que falta.'),
 q('Una colaboración incluyó a varias personas.','¿Qué debe registrarse?',['Solo el coordinador','Contribuciones y acuerdos de autoría','Solo la sede'],1,'Reconocer colaboraciones contribuye a una evaluación justa.','¿Quién hizo qué?')],
 [
 q('Una tesista necesita orientación.','¿Qué mentoría respeta su autonomía?',['Acordar metas y comentarios','Escribir su trabajo por ella','No responder sus preguntas'],0,'La tutoría apoya decisiones sin suplantar el trabajo de aprendizaje.','¿Cómo puede crecer la independencia?'),
 q('Te piden arbitrar un manuscrito.','¿Qué conducta es apropiada?',['Evaluar por amistad','Usar criterios claros y declarar conflictos','Divulgar información confidencial'],1,'Una evaluación íntegra requiere criterios y manejo de conflictos.','¿Qué puede sesgar la revisión?'),
 q('Un proyecto vincula ciencia y comunidad.','¿Qué debe evitarse?',['Escuchar a la comunidad','Acordar resultados','Imponer soluciones sin diálogo'],2,'La vinculación es más sólida cuando incorpora las necesidades locales.','¿Quién conoce el contexto?'),
 q('Dos investigadores discrepan.','¿Qué facilita una conversación constructiva?',['Comparar argumentos y datos','Descalificar por jerarquía','Evitar cualquier revisión'],0,'El diálogo basado en evidencia ayuda a corregir y aprender.','El desacuerdo puede ser productivo.')],
 [
 q('Diriges una red interdisciplinaria.','¿Qué acuerdo facilita la coordinación?',['Silenciar diferencias','Objetivos, términos y responsabilidades compartidas','Un único método obligatorio'],1,'El trabajo de varias áreas necesita lenguaje y decisiones explícitas.','¿Qué deben compartir antes de empezar?'),
 q('Un programa forma jóvenes investigadoras.','¿Qué demuestra aprendizaje duradero?',['Capacidades para aplicar el método','Solo certificados','Una foto con autoridades'],0,'Aprender implica competencias que se pueden usar y explicar.','¿Pueden aplicar lo aprendido?'),
 q('Una comunidad solicita una tecnología.','¿Qué evaluación debe realizarse?',['Solo revisar el presupuesto','Descartar opiniones locales','Necesidades, riesgos y permisos de uso'],2,'La transferencia requiere contexto y acuerdos responsables.','¿Quién usará esa tecnología?'),
 q('Los resultados de varios estudios difieren.','¿Cómo sintetizarlos?',['Elegir los más cómodos','Comparar métodos, límites y hallazgos','Excluir los negativos'],1,'Una síntesis crítica examina coincidencias y desacuerdos.','¿Qué explica la diferencia?')],
 [
 q('Un consorcio prepara su estrategia.','¿Qué prioridades son justificables?',['Evidencia, necesidades y viabilidad','Moda mediática del día','Solo prestigio personal'],0,'La estrategia científica debe considerar beneficios y recursos.','¿Qué efectos y limitaciones hay?'),
 q('Se detecta un error en datos compartidos.','¿Qué protege la confianza?',['Ocultarlo','Investigar y corregir con transparencia','Responsabilizar sin revisar'],1,'Corregir errores documentadamente fortalece la integridad.','¿Qué querría saber quien use los datos?'),
 q('Vas a publicar una base abierta.','¿Qué revisar primero?',['Número de descargas','Diseño de la portada','Licencias, privacidad y seguridad'],2,'La apertura es compatible con reglas de protección y consentimiento.','Hay datos que no deben divulgarse.'),
 q('Un equipo tiene dudas sobre autoría.','¿Qué práctica responsable conviene?',['Acordar y documentar aportes reales','Asignar por fama','Ignorar a personal de apoyo'],0,'La autoría justa exige reconocer responsabilidades y contribuciones.','Piensa en el trabajo de cada participante.')],
 [
 q('Una joven investigadora pide consejo.','¿Qué ayuda a continuar aprendiendo?',['Prometer éxito sin esfuerzo','Fomentar preguntas, apoyo y curiosidad','Prohibir el error'],1,'Una mentoría valiosa transmite autonomía y pensamiento crítico.','La curiosidad es el punto de partida.'),
 q('Guardas la historia de un proyecto.','¿Qué hace útil el archivo?',['Conservar fechas, contexto y aportaciones','Guardar solo premios','Eliminar resultados fallidos'],0,'La memoria de investigación incluye procesos y equipos completos.','¿Qué le serviría a alguien del futuro?'),
 q('Un estudiante cuestiona tu conclusión antigua.','¿Qué postura favorece la ciencia?',['Invocar autoridad','Ignorar al estudiante','Revisar juntos la evidencia'],2,'La experiencia no reemplaza la revisión crítica.','Todas las conclusiones se pueden discutir.'),
 q('Compartes recuerdos académicos.','¿Qué historia enseña más?',['Solo una lista de honores','Aciertos, errores y aprendizajes','Un relato sin colaboradores'],1,'Relatar dificultades y apoyos muestra la dimensión humana de aprender.','¿Qué habrías querido saber antes?')]
];

function fromExtra(activityId:string,stepIndex:number,extra:Extra):LearningStep {
 const [scene,question,a,b,c,correct,explanation,hint]=extra;
 return {activityId,stepIndex,scene,question,options:[a,b,c],correct,explanation,hint};
}
/** Genera siempre la misma secuencia: no modificar índices de versiones publicadas. */
export function learningSequence(activityId:string):readonly LearningStep[] {
 const original=challengeForActivity(activityId);
 const activity=ACTIVITIES.find(a=>a.id===activityId);
 if(!original||!activity)return [];
 const extras=activity.minStage===0?KINDER[activityId]:STAGE_BANK[activity.minStage];
 if(!extras||extras.length<4)return [];
 const chosen=activity.minStage===0?extras.slice(0,4):extras;
 return [{...original,stepIndex:0},...chosen.map((item,i)=>fromExtra(activityId,i+1,item))];
}
export const STEP_COUNT=5;
/** Evita aceptar como terminado un progreso incompleto, duplicado o ajeno. */
export function masteredSteps(progress:Readonly<Record<string,readonly number[]>>|undefined,activityId:string):number {
 const set=new Set(progress?.[activityId]??[]);
 return Array.from({length:STEP_COUNT},(_,i)=>i).filter(i=>set.has(i)).length;
}
export function validateLearningSequences():string[]{
 const errors:string[]=[];
 if(STAGE_BANK.length!==STAGES.length)errors.push('Bancos de etapa incompletos');
 for(const activity of ACTIVITIES){
  const seq=learningSequence(activity.id);
  if(seq.length!==STEP_COUNT)errors.push(`${activity.id}: ${seq.length} pasos`);
  if(new Set(seq.map(s=>s.question)).size!==seq.length)errors.push(`${activity.id}: preguntas duplicadas`);
  for(const [index,s] of seq.entries()){
   if(s.stepIndex!==index||!s.scene||!s.hint||!s.explanation||s.options.length!==3||s.options.some(o=>!o.trim())||s.correct<0||s.correct>2)errors.push(`${activity.id}: pregunta ${index} incompleta`);
  }
 }
 return errors;
}
