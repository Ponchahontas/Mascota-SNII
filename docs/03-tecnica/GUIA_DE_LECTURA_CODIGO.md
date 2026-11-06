# Guía de lectura del código de Academic Pet

**Versión de referencia:** 0.11.0. Esta guía explica qué hace cada parte y cómo revisarla sin alterar reglas o partidas.

## Una interacción, de principio a fin

1. **`src/main.ts`** arranca la aplicación.
2. **`src/ui/app.ts`** dibuja la pantalla y recibe eventos. Busca `creation()` (adopción), `avatar()` (personaje), `guidedLearningPanel()` (cinco preguntas), `areaCareerPanel()` (misiones/rutas) y el controlador `data-action`. **No debe sumar premios directamente.**
3. **`src/core/game-coordinator.ts`** prepara el comando, identificador único y revisión esperada.
4. **`src/core/persistence.ts`** valida la revisión e idempotencia, guarda snapshot y comando en una única transacción IndexedDB y permite importar/exportar JSON.
5. **`src/core/engine-game.ts`** calcula efectos sobre una *copia* del estado; valida etapas, recompensas, cuidados, misiones y rutas. Un resultado del motor no es duradero hasta confirmar la transacción.
6. **`src/core/state.ts`** define `GameSave` y campos opcionales para versiones previas.
7. **`src/core/engine-health.ts` y `engine-needs.ts`** calculan desgaste, dificultad, crisis y cuidados.

## Catálogos, interfaz y recursos

| Archivo | Responsabilidad | Precaución |
| --- | --- | --- |
| `src/data/catalog.ts` | 14 etapas, economía, nueve áreas y cuidado | `stageIndex` se guarda; no reordenar etapas sin migración. |
| `src/data/stage-activities.ts` | Seis actividades por etapa | `activity.id` es clave persistente. |
| `src/data/learning-path.ts` | Primer reto, pregunta y explicación | Revisar claves tras cambiar la redacción. |
| `src/data/activity-extras.ts` | Cuatro preguntas adicionales por actividad | Pistas y soluciones deben corresponder al mismo tema. |
| `src/data/learning-sequences.ts` | Orden de cinco descubrimientos | Índices `0..4` persisten en partidas. |
| `src/data/scene-world.ts` | Escenarios y estaciones | Unir siempre por `activity.id`. |
| `src/data/area-routes.ts` | 126 temas de campo y 18 finales | IDs de especialización no se renombran. |
| `src/data/pet-visuals.ts` | Nueve especies y cuadros | Coincidencia con `AREAS` y nueve SVG. |
| `scripts/generate-pets.py` | Generación reproducible de sprites | Validar los 14 cuadros tras cambios. |
| `src/ui/pet-animation.ts` | Emociones y reacciones visuales | No cambiar recursos del juego. |
| `src/styles.css` | Paisajes, disposición, animación y responsividad | Archivo grande: revisar con criterio de regresión visual. |
| `public/sw.js` | Caché de recursos públicos y offline | Sumar nuevos assets, cambiar versión y no borrar cachés ajenas. |

## Tres procedimientos para revisores

**Modificar una pregunta:** preservar ID e índice, asegurar opción única e inequívoca, pista y explicación. Ejecutar `npm test` y verificar que el acierto no consume PA ni cobra recompensa dos veces.

**Modificar áreas o sprites:** actualizar catálogo, especie, ruta, SVG, generador y precaché; probar que antiguas partidas recuperan correctamente su área.

**Modificar persistencia, economía o tiempo offline:** cambiar motor/transacción y tests; verificar migraciones. No editar directamente recursos desde la UI. Evitar asignar premios en el DOM.

## Estándares de revisión

- Comentarios y JSDoc explican **motivo, contratos, invariantes, cambios peligrosos y compatibilidad**, no cada instrucción obvia.
- Leer primero [auditoría de requisitos](../01-proyecto/AUDITORIA_CUMPLIMIENTO_2026_11_06.md), [arquitectura](ARQUITECTURA.md) y [pruebas](../04-calidad/PRUEBAS_Y_ACEPTACION.md).
- Ejecutar `npm install`, `npm run typecheck`, `npm test` y `npm run build`; revisar el estado de GitHub Actions para el commit actual.
- Un build o suite de Node **no** sustituye pruebas de teclado, lector de pantalla, móvil y PWA en navegador.
- El proyecto contiene **datos y recompensas ficticias**; no atribuirlas a los criterios oficiales del SNII.
