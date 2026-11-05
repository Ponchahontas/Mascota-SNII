# v0.8 — Misiones educativas y ambientes ilustrados

## Objetivo de esta iteración

La experiencia educativa de v0.7 tenía un único reto por actividad. Repetirlo
producía una experiencia mecánica. Ahora **cada actividad contiene cinco pasos**,
con retroalimentación y marcadores guardados, y la mascota puede viajar a seis
lugares interactivos dentro de un pequeño entorno visual por etapa.

## Flujo de la persona jugadora

1. Elige la estación ilustrada o la tarjeta de una actividad propia de la etapa.
2. La mascota se desplaza mediante CSS hacia la estación; no se consume recurso.
3. Se abre el siguiente de cinco desafíos. Cada respuesta equivocada muestra
   una pista: **no consume PA, CR, UPE y no genera estrés**.
4. Cada acierto se registra mediante `learning.answer` en la misma transacción
   de IndexedDB usada por el juego. El progreso **sobrevive a cerrar/reabrir**.
5. Tras acertar 5/5, se muestra una felicitación y se desbloquea **Repetir**
   para esa actividad. Las cinco respuestas no conceden UPE directamente.
6. El jugador puede confirmar la práctica guiada (consumo y recompensa normales,
   con bono inicial de +25 % en el cálculo de UPE), ir a otra aventura, o usar
   «Repetir» (sin el bono inicial; sujeto a rendimiento y rendimiento decreciente).

## Balance y límites

- Preguntas gratuitas, con pistas y explicaciones. Un acierto se confirma
  atómicamente, evitando duplicados por recarga o clic accidental.
- **Primera práctica guiada:** 1,25 × experiencia ajustada por condición vital,
  recompensa de etapa, diversidad y repetición; el resultado se redondea.
- «Repetir»: recompensa habitual, sujeta al desgaste, PA, créditos y racha.
- Se exige cinco aciertos para las modalidades nuevas `guided` o `repeat`.
  Comandos heredados sin `practiceMode` siguen admitidos por compatibilidad de
  contrato anterior. El jugador no ve esa ruta en la interfaz.
- **Progreso de aprendizaje** no es requisito adicional para aprobar una etapa:
  la promoción mantiene los límites habituales de UPE, evidencias, competencia
  y bienestar. Se evita forzar las seis aventuras para poder avanzar.
- El texto referente al SNII es un recurso satírico/educativo, no una evaluación
  normativa ni una certificación oficial.

## Alcance del banco de preguntas

Existen **84 actividades × 5 posiciones = 420 pasos jugables**.
En las seis aventuras de Kínder, las cuatro preguntas añadidas son específicas
por actividad (30 preguntas diferentes contando las originales). En Primaria
hasta Emérito, cada actividad tiene su reto original más cuatro preguntas
**transversales de su etapa**: los cuatro temas se comparten entre las seis
actividades de ese nivel. Esto constituye un MVP educativo, no 420 preguntas
completamente distintas. Una siguiente iteración debe incorporar preguntas
individuales por actividad para esos 13 niveles sin reordenar los índices ya
persistidos. No sustituir contenido de una posición ya publicada sin plan de
migración y pruebas de coherencia del progreso.

## Arquitectura

- `src/data/learning-path.ts`: textos narrativos y primer reto de las 84 actividades.
- `src/data/learning-sequences.ts`: cuatro preguntas adicionales, secuencia y
  comprobación de completitud; no ejecuta cambios.
- `src/data/scene-world.ts`: escena y nombre, seis estaciones por nivel.
- `src/core/state.ts`: `learningProgress?` (índices acertados por ID de actividad)
  y `learningRewarded?` (IDs de primer bono ya reclamado). Campos opcionales
  para cargar partidas v0.7 anteriores sin perder progreso.
- `src/core/engine-game.ts`: orden `learning.answer` y condición de práctica;
  contabilidad de bono único en `activity.execute`.
- `src/core/persistence.ts`: valida importaciones y la transacción de guardado.
- `src/ui/app.ts`: tarjetas, panel de reto, progreso, estaciones y movimiento.
- `src/styles.css`: estilos de paisaje, viaje y señales de progreso.
- `public/sw.js`: precarga de los dos nuevos módulos para uso sin conexión.

## Accesibilidad y comprobaciones

- Cada estación tiene nombre accesible, no depende solo de iconos.
- Cada paso indica acierto/péndiente mediante texto además de color.
- Los 5 pasos se presentan con una barra de progreso que expone `aria-valuenow`.
- Animaciones desactivables manualmente y con `prefers-reduced-motion`.
- Ejecutar `npm run typecheck` y `npm test`. Además verificar en navegador real:
  transición del avatar sin bloquear botones, foco tras cada respuesta,
  comportamiento a 375 px, grabado tras recargar, y PWA offline.
- **Pendiente:** prueba visual automatizada en este entorno; Chromium devolvió
  `ERR_BLOCKED_BY_ADMINISTRATOR` tanto para localhost como para `file://`.
