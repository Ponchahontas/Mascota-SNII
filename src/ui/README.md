# Interfaz — guía para modificar pantallas

`app.ts` presenta las acciones del usuario; `pet-animation.ts` representa necesidades. La capa visual NO entrega recompensas: solo presenta resultados de comandos confirmados.

La ruta de campo se consulta en `areaCareerPanel()`; `AREA_ROUTES`, `branchOf()` y `fieldChallenge()` generan título, ramas y opciones. `choose-route` y `field-answer` emiten comandos al motor. Respuestas equivocadas son gratuitas, no cambian la partida.

El escenario de las seis estaciones de una etapa y sus preguntas se vincula por `activity.id`, **independientemente** de `areaId`. Esto permite añadir un recorrido temático por área sin romper los cinco pasos de cada aventura.

Comprobar diseño móvil, foco de teclado y preferencias de movimiento reducido. Documentos: [Áreas y rutas](../../docs/02-juego/AREAS_Y_RUTAS.md) · [Arquitectura](../../docs/03-tecnica/ARQUITECTURA.md).

**v0.12.0:** tras registrar la misión de campo, Carrera conserva la explicación `challenge.explanation`. La UI solo presenta el resultado y no adjudica recompensas; el motor se encarga de ellas.
