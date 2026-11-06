# Arquitectura técnica — v0.10.0

Aplicación estática local-first en TypeScript/HTML/CSS/SVG; transpilada a `dist/` por `scripts/build.mjs`. No usa backend para el progreso ordinario. Persistencia con IndexedDB, caché pública con Cache Storage y exportación/importación manual JSON.

## Flujo de una acción

`src/ui/app.ts` → `src/core/game-coordinator.ts` → transacción `src/core/persistence.ts` → motor `src/core/engine-game.ts` (estado inmutable de salida) → confirmación y render. **La UI no adjudica UPE**; la capa de transacción evita que reintentar una orden duplique beneficios.

## Módulos vigentes

- `src/core/`: estado, recursos, necesidad/salud, comandos, idempotencia y guardado.
- `src/data/catalog.ts`: nueve áreas, 14 etapas, cuidado y eventos.
- `src/data/stage-activities.ts`: 84 actividades por etapa.
- `src/data/learning-path.ts`, `activity-extras.ts`, `learning-sequences.ts`: cinco pasos por actividad, con ID estable.
- **`src/data/area-routes.ts`**: un foco de campo por área y etapa, dos ramas por área, validadores y finales de relato.
- `src/data/scene-world.ts`: estaciones por etapa y relación por `activity.id`.
- `src/data/pet-visuals.ts`, `public/pets/`, `scripts/generate-pets.py`: nueve sprites originales (14 cuadros por mascota).
- `src/ui/app.ts`, `pet-animation.ts` y `src/styles.css`: interacción, movimiento, emociones y elección de rama.
- `public/sw.js`, `netlify.toml`: PWA estática y despliegue.

## Compatibilidad

`schemaVersion` se mantiene en **2**. `areaPath` y `fieldMilestones` son opcionales, así se pueden importar partidas de siete áreas previas a v0.10.0. Cambiar IDs de área, ramas, actividades o índices de pasos requiere análisis de migración antes de publicar.

Consultar [Persistencia](PERSISTENCIA_Y_COMANDOS.md), [Áreas](../02-juego/AREAS_Y_RUTAS.md) y [Contribuir](../../CONTRIBUTING.md).
