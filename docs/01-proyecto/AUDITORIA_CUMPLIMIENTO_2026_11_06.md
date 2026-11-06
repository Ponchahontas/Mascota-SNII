# Auditoría de cumplimiento y entrega a revisores — Academic Pet

**Fecha:** 6 de noviembre de 2026 · **Versión auditada:** v0.11.0 · **Alcance:** código, documentación, pruebas automáticas y preparación de publicación. No se cambian mecánicas.

**Estados:** **Implementado** = hay código y pruebas pertinentes; **Parcial** = funciona solo parte de lo pedido; **Pendiente** = no existe implementación; **Por validar** = hay código, pero faltan pruebas reales de interacción.

## Matriz de requisitos acumulados

| Solicitud | Estado | Evidencia o límite |
| --- | --- | --- |
| Nueve áreas del conocimiento | **Implementado** | `AREAS` en `src/data/catalog.ts`. Coinciden con las nueve denominaciones del DOF 06/02/2026; el juego no reproduce los criterios oficiales. |
| Nueve mascotas originales | **Implementado** | `PET_KINDS` y nueve sprites en `public/pets/`. Siete IDs legados conservados. |
| Catorce evoluciones por mascota (126 cuadros) | **Implementado** | Cada sprite SVG tiene catorce cuadros de 32×32 px; `spriteFrame` elige edad. |
| Catorce etapas de Kínder a Emérito | **Implementado** | `STAGES` y `career.confirmTransition`; avance lúdico, no dictamen real. |
| Seis estaciones por etapa, cada botón abre su propia aventura | **Implementado; por validar visualmente** | `scene-world.ts` y `learningStation` enlazan mediante `activity.id`. |
| Cinco preguntas por actividad; 84 aventuras y 420 descubrimientos | **Implementado** | `learning-sequences.ts`, `activity-extras.ts`, `learning-path.ts`. No cuentan con revisión externa de docentes. |
| Pistas, explicaciones, aciertos guardados, repeticiones | **Implementado** | `learning.answer`, `learningProgress`, bonificación única en el motor. |
| Paisajes, mascota que camina a estación, emociones y animaciones | **Implementado; por validar visualmente** | `src/ui/app.ts`, `pet-animation.ts`, `src/styles.css`. |
| Animación particular de la mascota manipulando objetos en cada acción | **Parcial** | Hay desplazamiento y reacciones, pero no animación individual para las 84 actividades. |
| Nueve caminos educativos por área/etapa | **Parcial** | 126 misiones de campo temáticas; las **seis aventuras base de cada etapa se comparten entre áreas**. |
| Dos especializaciones por área y finales diferenciados | **Implementado** | `career.chooseRoute`, `fieldChallenge`; dieciocho desenlaces narrativos. No son nueve videojuegos separados. |
| Minijuegos de arrastrar, construir, ordenar o experimentar | **Pendiente** | Las actividades usan preguntas de opción múltiple, no manipulación de objetos. |
| **Mínimo de un día real por etapa** | **Pendiente** | `career.confirmTransition` no registra ni exige 24 h desde la entrada a la etapa. Requiere campo de fecha y migración compatibles. |
| Energía, estrés, motivación, concentración, bienestar y dificultades | **Implementado; balance por validar** | Tres dificultades, cuidados y crisis en `engine-health.ts`/`engine-game.ts`. |
| Guardado local, respaldo JSON, progreso offline limitado | **Implementado; por validar en dispositivo** | IndexedDB, export/import, hasta ocho horas de procesamiento por ausencia; no hay sincronización en la nube. |
| PWA y Netlify | **Implementado; instalación por validar** | `manifest.webmanifest`, `sw.js`, `netlify.toml`. La compilación no acredita funcionamiento en iOS/Android. |
| Criterios reales SNII por área y nivel 2026 | **Pendiente** | Se usan nombres de áreas oficiales; recompensas, umbrales y evidencias son ficticios. No se han integrado los criterios específicos de evaluación de 2026. |
| Marca propia «Academic Pet» | **Implementado visualmente** | HTML, PWA, exportaciones y README. Identificadores legados se conservan internamente para abrir partidas. Falta análisis registral. |
| Código comentado y documentación para desarrolladores | **Parcial / mejorado** | Guías por componente, JSDoc e invariantes; la UI y CSS aún tienen grandes bloques compactos que agradecerían modularización. |
| Evaluación de seguridad, accesibilidad y contenido para menores | **Por validar** | Se requieren pruebas móviles, teclado, lector de pantalla y revisión pedagógica antes de presentar el juego como terminado. |

## Hallazgos corregidos en esta auditoría

1. **Documentación desfasada:** cabeceras de guías que indicaban v0.10 se sincronizaron con v0.11.0, sin modificar material histórico.
2. **Comentarios inexactos:** CSS aún hablaba de siete especies y el módulo de preguntas llamaba manipulativos a retos de selección; ambos corregidos.
3. **Referencias obsoletas:** se sustituyeron enlaces en comentarios de código que remitían a guías históricas por las guías técnicas vigentes.
4. **Mapeo del código:** se añadió [guía de lectura](../03-tecnica/GUIA_DE_LECTURA_CODIGO.md) con módulos, responsabilidades y advertencias de compatibilidad.
5. **Integridad automatizada:** prueba de precaché PWA, documentación y presencia consistente de las nueve áreas.

## Comprobaciones y límites

Antes de las modificaciones documentales, la copia de v0.11.0 pasó **77/77 pruebas** y `npm run typecheck`. Se comprobaron **103 enlaces Markdown locales** sin errores. Con la nueva prueba de integridad, consultar la cifra del commit final en GitHub Actions.

El servidor de desarrollo respondió HTTP 200, pero **Chromium no completó la navegación** en el entorno de auditoría. No se certifican la interfaz en dispositivos, instalación offline, accesibilidad, balance prolongado ni la validez pedagógica.

Se consultó la [lista de nueve áreas del DOF 06/02/2026](https://sidof.segob.gob.mx/notas/docFuente/5779537). También existen [criterios específicos de evaluación de 2026](https://sidof.segob.gob.mx/notas/docFuente/5785593), que no están convertidos en reglas de Academic Pet.

## Próximas decisiones antes de anunciar «producto terminado»

1. **P0 — Prueba de uso real:** nueve mascotas, catorce edades, seis estaciones, cinco preguntas, cambios de ruta, resguardo, importación, PWA y sesión sin red.
2. **P0 — Accesibilidad:** teclado, foco, contraste, lector de pantalla, movimiento reducido y visualización móvil.
3. **P1 — Diseño de etapas:** decidir cómo aplicar **24 horas por etapa** sin bloquear demos ni invalidar partidas anteriores.
4. **P1 — Diferenciación por área:** crear actividades y preguntas particulares para cada disciplina, preservando IDs de guardado.
5. **P1 — Aprendizaje activo:** minijuegos manipulativos con alternativas accesibles; revisión educativa externa.
6. **P1 — Mantenibilidad:** dividir gradualmente `src/ui/app.ts` y `src/styles.css` con pruebas E2E e integración de IndexedDB.
7. **P2 — Normativa, marca y licencias:** contrastar criterios oficiales si se describen evaluaciones reales, comprobar «Academic Pet» en IMPI y definir `LICENSE`.

**Conclusión:** Academic Pet es un **MVP educativo funcional y documentado**, no un juego terminado, un sistema de evaluación oficial ni un producto comercial jurídicamente autorizado. Conservar esta matriz como lista de pendientes verificable.
