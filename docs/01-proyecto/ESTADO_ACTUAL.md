# Estado actual de Mascota-SNII

**Corte: 6 de noviembre de 2026.** **MVP v0.10.0**; no significa producto final ni implementación exhaustiva del SNII.

## Implementado

| Parte | Estado y código |
|---|---|
| Nueve áreas y nueve mascotas | `src/data/catalog.ts`, `src/data/pet-visuals.ts`, `public/pets/` |
| 14 etapas y 126 cuadros de evolución | `src/data/catalog.ts`, `scripts/generate-pets.py` |
| 126 misiones de área por etapa | `src/data/area-routes.ts`, `career.completeFieldMission` |
| Dos especializaciones por área y 18 cierres de ruta | `career.chooseRoute`, `AREA_ROUTES`, historial/logros |
| 84 actividades, 420 preguntas y seis estaciones por nivel | `src/data/stage-activities.ts`, `learning-sequences.ts`, `scene-world.ts` |
| Cuidados, dificultad, crisis y deserción lúdica | `engine-game.ts`, `engine-health.ts` |
| Progreso guardado, idempotencia, import/export local | `persistence.ts`, `state.ts` |
| Interfaz con mascota animada y ambientación | `src/ui/`, `src/styles.css` |
| PWA y Netlify | `public/sw.js`, `netlify.toml` (configuración técnica) |

## Evidencia de pruebas

El paquete local de v0.10.0 ha pasado **71 pruebas automatizadas** incluyendo comprobaciones documentales. En GitHub Actions se debe consultar el resultado del último commit, no reutilizar el resultado de una versión anterior.

## Pendiente

- Revisión pedagógica externa de preguntas y secuencias por nivel educativo.
- Actividades más específicas por **área + etapa** (hoy las seis aventuras de cada nivel se comparten y las nueve rutas aportan retos de campo temáticos).
- Minijuegos manipulativos, más allá de preguntas de opción múltiple.
- Pruebas visuales reales en móviles, teclado, lectores de pantalla, offline/PWA.
- Pruebas de carga de partidas y balance prolongado, incluidas migraciones futuras.
- Contraste permanente con normas oficiales, sin convertir puntos ficticios en métricas oficiales.

Consulta [Hoja de ruta](HOJA_DE_RUTA.md), [Áreas y rutas](../02-juego/AREAS_Y_RUTAS.md) y [Pruebas](../04-calidad/PRUEBAS_Y_ACEPTACION.md).
