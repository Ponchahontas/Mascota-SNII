# v0.9 — Cada estación abre su propia aventura

## Informe de corrección

En la captura compartida, seleccionar «Construir con bloques» mostraba una
cabecera genérica «Expedición educativa» (aunque la primera escena sí hablaba de
bloques). Además, en v0.8 las cuatro preguntas posteriores eran compartidas entre
las seis actividades del mismo nivel, excepto en Kínder.

Ahora **cada estación tiene un ID estable y un banco relacionado con ese ID**:

- La fuente única del catálogo por etapa es `activitiesForStage(stageIndex)`.
- `stationsForStage` y `learningStation` (`src/data/scene-world.ts`)
  garantizan que el botón del entorno, la actividad lateral, la animación y las
  preguntas apunten al **mismo** `activity.id`.
- La interfaz (`src/ui/app.ts`) muestra icono, nombre completo, etapa y número
  de estación en la cabecera de cada aventura. Las dos ubicaciones aparecen
  destacadas mientras está abierta, incluso al cambiar de una estación a otra.
- `learningSequence` y `src/data/activity-extras.ts` enlazan cinco preguntas
  con el mismo ID. Los primeros desafíos son originales (`learning-path.ts`),
  Kínder conserva sus cuatro preguntas específicas adicionales, y las 78
  actividades posteriores cuentan con cuatro momentos diseñados para su tema:
  **preparar, realizar, verificar y comunicar**.
- En total hay **420 textos de pregunta diferentes**. Los cuatro momentos
  posteriores a Kínder comparten una estructura didáctica, pero utilizan
  soluciones/contextos redactados para cada actividad: no son 312 juegos
  manipulativos independientes.

## Persistencia y compatibilidad

Los IDs de actividad y los índices de pasos (0..4) NO cambiaron. Las partidas
v0.8 conservan todos sus aciertos, incluso si algunas preguntas se han
actualizado; los logros previamente ganados se respetan, sin obligar a repetir.
Como alternativa educativa, una aventura completada muestra el desplegable
**«Consultar las cinco preguntas»**, gratis y sin modificar la partida.

No se altera la economía del juego, los PA, la progresión, la dificultad, los
requisitos ficticios del SNII ni el modelo de almacenamiento. La selección de
una estación **no concede recompensas** y tampoco debe alterar el guardado.

## Cómo probar manualmente

1. Abrir una partida de Kínder y pulsar **🧱 Construir con bloques** en el
   escenario. La cabecera debe decir «Construir con bloques», estación 2/6.
2. Comprobar que el primer reto trata sobre una torre y que el resto de los
   retos de esa aventura tratan sobre equilibrio de bloques.
3. Pulsar **🌱 Explorar semillas** sin cerrar la aventura. Deben cambiar
   inmediatamente el icono, el título y la pregunta; la estación 3/6 se marca.
4. Responder una pregunta, alternar entre ambas estaciones y comprobar que los
   aciertos anteriores permanecen en su propia actividad.
5. Completar una aventura: debe aparecer el botón para practicar y un
   desplegable de repaso; no se debe reiniciar el progreso al cerrar el panel.
6. Repetir en Primaria, Universidad, Doctorado y Emérito: verificar que las
   cuatro preguntas adicionales mencionan específicamente la actividad elegida.
7. Comprobar el cambio en móvil y con preferencia de movimiento reducido.

## Pruebas automatizadas

`npm run typecheck && npm test`

`tests/station-links.test.mjs` verifica las 84 correspondencias, los cinco
pasos por actividad, los 420 textos no duplicados, la prohibición de abrir
actividades de otra etapa, la separación de los aciertos y la ausencia de
mutaciones por consultar la estación. Las pruebas no reemplazan la verificación
visual manual con teclado, lector de pantalla y navegadores móviles.

## Mantenimiento del código

Cuando se agregue una actividad, actualizar `ACTIVITY_ROWS`, su primer reto en
`learning-path.ts` y sus cuatro respuestas específicas en `activity-extras.ts`
(o el banco propio de Kínder). El ID debe ser estable y único. Ajustar los
recursos de `public/sw.js` si se agregan nuevos módulos, incrementar el nombre
de su caché y ejecutar todas las pruebas.
