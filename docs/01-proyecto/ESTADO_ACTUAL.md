# Estado actual de Academic Pet (repositorio Mascota-SNII)

**Actualizado: 6 de noviembre de 2026.** **MVP v0.12.0**; no significa producto final ni implementación exhaustiva del SNII.

## Implementado

| Parte | Estado y código |
|---|---|
| Nueve áreas y nueve mascotas | `src/data/catalog.ts`, `src/data/pet-visuals.ts`, `public/pets/` |
| 14 etapas y 126 cuadros de evolución | `src/data/catalog.ts`, `scripts/generate-pets.py` |
| 126 misiones de área: 36 escolares y 90 casos avanzados por disciplina | `src/data/area-routes.ts`, `src/data/research-cases.ts`, `career.completeFieldMission` |
| Dos especializaciones por área y 18 cierres de ruta | `career.chooseRoute`, `AREA_ROUTES`, historial/logros |
| 84 actividades, 420 preguntas y seis estaciones por nivel | `src/data/stage-activities.ts`, `learning-sequences.ts`, `scene-world.ts` |
| Cuidados, dificultad, crisis y deserción lúdica | `engine-game.ts`, `engine-health.ts` |
| Progreso guardado, idempotencia, import/export local | `persistence.ts`, `state.ts` |
| Interfaz con mascota animada y ambientación | `src/ui/`, `src/styles.css` |
| PWA y Netlify | `public/sw.js`, `netlify.toml` (configuración técnica) |

## Evidencia de pruebas

La auditoría local de v0.11.0 pasó 77 pruebas automatizadas antes de añadir comprobaciones documentales adicionales. La cifra de referencia definitiva depende del último commit y debe revisarse en GitHub Actions. Las pruebas automáticas no certifican la interfaz en dispositivos reales.

Consulta también la [auditoría de todos los requisitos](AUDITORIA_CUMPLIMIENTO_2026_11_06.md), que distingue funciones completas, parciales y aún no implementadas.

## Pendiente

- Revisión pedagógica externa de preguntas y secuencias por nivel educativo.
- Actividades más específicas por **área + etapa** (hoy las seis aventuras de cada nivel se comparten y las nueve rutas aportan retos de campo temáticos).
- Minijuegos manipulativos, más allá de preguntas de opción múltiple.
- Pruebas visuales reales en móviles, teclado, lectores de pantalla, offline/PWA.
- Pruebas de carga de partidas y balance prolongado, incluidas migraciones futuras.
- Contraste permanente con normas oficiales, sin convertir puntos ficticios en métricas oficiales.

La marca visible y los respaldos nuevos usan **Academic Pet**. El identificador técnico de IndexedDB permanece intacto para preservar partidas. Ver [Identidad y compatibilidad](IDENTIDAD_Y_COMPATIBILIDAD.md).

Consulta [Hoja de ruta](HOJA_DE_RUTA.md), [Áreas y rutas](../02-juego/AREAS_Y_RUTAS.md) y [Pruebas](../04-calidad/PRUEBAS_Y_ACEPTACION.md).

### Mejora pedagógica v0.12.0

Las etapas desde Universidad hasta Emérito tienen **90 estudios de caso de campo** (nueve áreas por diez etapas), con decisiones metodológicas, éticas y de interpretación contextual. La explicación permanece visible al completar el caso. Las 84 aventuras principales de cinco pasos siguen siendo compartidas por etapa y requieren revisión docente. [Guía de casos](../02-juego/CASOS_DE_INVESTIGACION.md).
