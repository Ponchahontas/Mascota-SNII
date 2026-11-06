# Datos del juego — fuente de verdad de contenido

| Módulo | Responsabilidad |
|---|---|
| `catalog.ts` | Nueve áreas, 14 etapas, balance y cuidados |
| `pet-visuals.ts` | Nueve tipos de mascota, paletas y SVG |
| `area-routes.ts` | Temas 9 × 14, dos especializaciones por área y misión de campo |
| `stage-activities.ts` | Seis actividades por etapa |
| `learning-path.ts`, `activity-extras.ts`, `learning-sequences.ts` | Cinco retos por actividad |
| `scene-world.ts` | Paisajes, estación y vínculo por `activity.id` |

### Si se modifica una ruta

Conservar `areaId`, `branch.id` y el orden de `themes[0..13]`. Completar la especie y sprite correspondiente, el precaché PWA y las pruebas. No se debe renombrar un área para cambiar simplemente su título visible; los IDs permanecen en partidas anteriores.

Ver [Áreas y rutas](../../docs/02-juego/AREAS_Y_RUTAS.md) y [Persistencia](../../docs/03-tecnica/PERSISTENCIA_Y_COMANDOS.md).
