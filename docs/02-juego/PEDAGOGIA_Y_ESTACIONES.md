# Pedagogía interactiva y correspondencia entre estaciones

## Contenido vigente de v0.9

- **14 etapas**, **seis actividades por etapa**: 84 aventuras.
- **Cinco pasos por aventura**: 420 posiciones con textos de pregunta diferenciados en esta versión.
- Kínder usa contenidos infantiles específicos; de Primaria a Emérito, los pasos complementarios exploran preparación, realización, verificación y comunicación según la actividad.
- La existencia de una pregunta distinta no equivale a una validación pedagógica: comprobar nivel, claridad, opciones correctas, retroalimentación y accesibilidad.

## Regla de identidad obligatoria

La identidad común es **`activity.id`**, no el texto ni la posición gráfica.

| Componente | Archivo |
| --- | --- |
| Lista de seis actividades y objetivos por etapa | `src/data/stage-activities.ts` |
| Reto inicial y contenidos base | `src/data/learning-path.ts` |
| Cuatro momentos adicionales y perfiles | `src/data/activity-extras.ts` |
| Secuencia de cinco pasos y validadores | `src/data/learning-sequences.ts` |
| Escenario, posiciones de estación y búsqueda por ID | `src/data/scene-world.ts` |
| Selección, apertura, progreso visual y acciones | `src/ui/app.ts` |
| Respuestas correctas en la partida | `src/core/engine-game.ts`; `src/core/state.ts` |

## Contrato al añadir o corregir una actividad

1. Elegir etapa y un `activity.id` estable y único. No reutilizar identificadores de otra aventura.
2. Registrar la actividad en el catálogo adecuado y confirmar que la escena la muestra entre sus seis estaciones.
3. Redactar **cinco retos pertinentes al mismo tema**, con tres opciones, una solución inequívoca, pista y explicación. No usar distractores absurdos.
4. Conservar los índices `0..4` de los pasos persistidos; si se reordenan, diseñar una migración.
5. Verificar que escenario, encabezado, selección lateral, pregunta, progreso y confirmación consulten el mismo ID.
6. Ejecutar pruebas de enlaces y progresión; comprobar también el navegador real.

## Guardado y compatibilidad

Los aciertos se mantienen por ID de actividad e índice. Las partidas anteriores conservan los pasos resueltos; la revisión de preguntas ya dominadas es de consulta, sin recompensa duplicada. La interfaz no debe adjudicar UPE directamente.

## Ejemplo

En Kínder, pulsar **Construir con bloques** debe seleccionar su estación y mostrar **Construir con bloques · Kínder · Estación 2 de 6** y preguntas relacionadas con bloques. Pulsar **Explorar semillas** debe cambiar también el contenido, los cinco pasos y el progreso, sin mezclar ambos.

Referencia detallada de la corrección: [v0.9 archivada](../historico/17_ESTACIONES_Y_AVENTURAS_V09.md).

Volver al [índice](../README.md).
