# Estado actual y alcance de Mascota-SNII

**Corte documental:** 4 de noviembre de 2026 · **versión del código:** v0.9. Esta página sustituye al antiguo resumen de proyecto para consultas del estado actual.

## Propósito

Juego web educativo y satírico, local-first, sobre una **trayectoria ficticia** en 14 etapas: Kínder, Primaria, Secundaria, Preparatoria + técnica, Universidad, Especialidad, Maestría, Doctorado, Posdoctorado, Candidato SNII, Nivel I, Nivel II, Nivel III y Emérito. El jugador acompaña y cuida; la mascota ejecuta las actividades apropiadas a su etapa.

## Inventario implementado en el repositorio

| Área | Estado | Código de referencia |
| --- | --- | --- |
| 14 etapas con balance y progresión | Implementado; balance provisional | `src/data/catalog.ts`; `src/core/engine-game.ts` |
| 84 actividades, seis por etapa | Implementado | `src/data/stage-activities.ts` |
| Cinco desafíos por actividad, 420 textos de preguntas | Implementado como contenido; pendiente de revisión pedagógica externa | `src/data/learning-sequences.ts`; `src/data/activity-extras.ts`; `src/data/learning-path.ts` |
| Escenarios con seis estaciones por etapa y selección por ID | Implementado; pendiente de validación visual manual | `src/data/scene-world.ts`; `src/ui/app.ts` |
| Siete especies por área, con 14 cuadros de evolución | Implementado como sprites SVG | `src/data/pet-visuals.ts`; `public/pets/` |
| Energía, motivación, concentración, bienestar, estrés; crisis y dificultad | Implementado; requiere balance longitudinal | `src/core/engine-health.ts` |
| Animaciones por estado y reacciones | Implementado en CSS/TypeScript | `src/ui/pet-animation.ts`; `src/styles.css` |
| PA, créditos, proyectos, eventos, logros, reinicios y legado | Implementado en el MVP, con simplificaciones | `src/core/engine-game.ts` |
| IndexedDB, exportación/importación y recuperación offline limitada | Implementado; pruebas de recuperación real pendientes | `src/core/persistence.ts` |
| PWA estática, service worker y configuración Netlify | Código preparado; despliegue público de esta versión no verificado | `public/sw.js`; `netlify.toml` |

El historial de la iteración v0.9 menciona **61 pruebas automatizadas** en ese momento. Un número de pruebas antiguo no acredita por sí solo nuevas modificaciones: ejecutar `npm test` para verificar el commit actual.

## No presentar como terminado

- Revisión didáctica por docentes de cada nivel y validación de las respuestas y distractores.
- Minijuegos manipulativos completos (arrastrar bloques, ordenar historias, laboratorios simulados).
- Pruebas reales en móviles, navegadores, accesibilidad y modo offline tras despliegue.
- Balance basado en sesiones longitudinales y usuarios reales.
- Actualización y contraste de reglas SNII con fuentes oficiales vigentes.
- Integración/publicación automática en un sitio Netlify confirmado.

## Definición de «funciona»

**Compila** no significa **está validado en navegador**. Ninguna pantalla, animación o PWA debe declararse lista para producción solo por pasar TypeScript y pruebas unitarias.

Volver al [índice](../README.md).
