# Arquitectura técnica vigente

## Resumen

Aplicación web **estática, TypeScript y local-first**. `scripts/build.mjs` compila recursos para `dist/`. No se usa un backend para el juego principal. Netlify publica los archivos estáticos.

## Recorrido de una acción

1. `src/ui/app.ts` recibe la interacción y muestra una vista del estado.
2. `src/core/game-coordinator.ts` prepara el comando.
3. `src/core/persistence.ts` valida revisión/idempotencia y realiza la transacción IndexedDB.
4. `src/core/engine-game.ts` y motores auxiliares calculan el siguiente estado sin tocar el DOM.
5. Tras confirmarse la escritura, la UI vuelve a representar el estado persistido.

## Mapa actual

| Capa | Archivos |
| --- | --- |
| Entrada y pantalla | `src/main.ts`; `src/ui/app.ts` |
| Animaciones | `src/ui/pet-animation.ts`; `src/styles.css` |
| Contratos de órdenes | `src/core/commands.ts`; `src/core/game-coordinator.ts` |
| Motor y necesidades | `src/core/engine-game.ts`; `src/core/engine-health.ts`; `src/core/engine-needs.ts` |
| Partidas | `src/core/state.ts`; `src/core/persistence.ts` |
| Etapas, actividades y cuidado | `src/data/catalog.ts`; `src/data/stage-activities.ts` |
| Preguntas y escenarios | `src/data/learning-path.ts`; `src/data/learning-sequences.ts`; `src/data/activity-extras.ts`; `src/data/scene-world.ts` |
| Especies y dibujos | `src/data/pet-visuals.ts`; `public/pets/` |
| PWA / build | `public/sw.js`; `public/manifest.webmanifest`; `scripts/build.mjs`; `netlify.toml` |
| Tests | `tests/*.test.mjs`; workflow de GitHub Actions |

## Normas de cambio

- Mantener la UI como capa de presentación; no otorgar PA, UPE o evidencias desde un clic del DOM.
- El motor produce resultados reproducibles; el guardado transaccional decide su confirmación.
- Estabilizar IDs de las actividades, órdenes y pasos educativos; las partidas los contienen.
- No guardar estados transitorios de animación como decisiones académicas.
- Documentar con JSDoc/TSDoc las invariantes y los motivos de las decisiones no obvias.

Comparar con [diagrama histórico propuesto](../historico/07_ESTRUCTURA_PROYECTADA.md), que incluye módulos **no implementados con esos nombres**.

Volver al [índice](../README.md).
