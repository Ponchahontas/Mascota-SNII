/**
 * @module data/learning-sequences
 * Banco de misiones de aprendizaje por actividad.
 *
 * Cada aventura se compone de cinco pasos: el desafío propio de v0.7 y
 * cuatro ejercicios adicionales. Kínder posee preguntas infantiles propias;
 * los minijuegos manipulativos aún no se han implementado. El resto usa
 * cuatro momentos concretos redactados para cada actividad:
 * preparar, ejecutar, verificar y comunicar, sin mezclar las estaciones.
 *
 * IMPORTANTE: esta biblioteca solo presenta conocimientos; acertar NO concede
 * PA, CR ni UPE. El motor registra aciertos y otorga recompensas al PRACTICAR.
 * Preguntas y claves son contenido educativo, no requisitos oficiales SNII.
 */
import { ACTIVITIES } from './catalog.js';
import { ACTIVITY_MOMENTS, activityContextSteps } from './activity-extras.js';
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

function fromExtra(activityId:string,stepIndex:number,extra:Extra):LearningStep {
 const [scene,question,a,b,c,correct,explanation,hint]=extra;
 return {activityId,stepIndex,scene,question,options:[a,b,c],correct,explanation,hint};
}
/** Genera siempre la misma secuencia: no modificar índices de versiones publicadas. */
export function learningSequence(activityId:string):readonly LearningStep[] {
 const original=challengeForActivity(activityId);
 const activity=ACTIVITIES.find(a=>a.id===activityId);
 if(!original||!activity)return [];
 // El primer reto y los cuatro siguientes siempre comparten activityId.
 // La selección de actividad no depende de la posición del botón en pantalla.
 if(activity.minStage===0){
  const extras=KINDER[activity.id];
  if(!extras||extras.length!==4)return [];
  return [{...original,stepIndex:0},...extras.map((item,i)=>fromExtra(activity.id,i+1,item))];
 }
 const extras=activityContextSteps(activity);
 if(extras.length!==4)return [];
 return [{...original,stepIndex:0},...extras.map((item,i)=>({...item,activityId:activity.id,stepIndex:i+1}))];
}
export const STEP_COUNT=5;
/** Evita aceptar como terminado un progreso incompleto, duplicado o ajeno. */
export function masteredSteps(progress:Readonly<Record<string,readonly number[]>>|undefined,activityId:string):number {
 const set=new Set(progress?.[activityId]??[]);
 return Array.from({length:STEP_COUNT},(_,i)=>i).filter(i=>set.has(i)).length;
}
export function validateLearningSequences():string[]{
 const errors:string[]=[];
 const advanced=ACTIVITIES.filter(activity=>activity.minStage>0);
 if(Object.keys(ACTIVITY_MOMENTS).length!==advanced.length)errors.push('Perfiles educativos individuales incompletos');
 for(const activity of ACTIVITIES){
  const seq=learningSequence(activity.id);
  if(seq.length!==STEP_COUNT)errors.push(`${activity.id}: ${seq.length} pasos`);
  if(new Set(seq.map(s=>s.question)).size!==seq.length)errors.push(`${activity.id}: preguntas duplicadas`);
  if(seq.some(step=>step.activityId!==activity.id))errors.push(`${activity.id}: pregunta perteneciente a otra estación`);
  for(const [index,s] of seq.entries()){
   if(s.stepIndex!==index||!s.scene||!s.hint||!s.explanation||s.options.length!==3||s.options.some(o=>!o.trim())||s.correct<0||s.correct>2)errors.push(`${activity.id}: pregunta ${index} incompleta`);
  }
 }
 return errors;
}
