# Catálogos educativos y visuales — guía actual

La carpeta `src/data/` define **contenido y configuración**, no recompensas ejecutadas por la interfaz. Los catálogos sí están implementados en el MVP v0.9.

| Archivo | Responsabilidad |
| --- | --- |
| `catalog.ts` | Etapas, tasas, necesidades, áreas y otros parámetros generales |
| `stage-activities.ts` | 84 actividades exclusivas, seis por cada etapa |
| `learning-path.ts` | Retos iniciales y contenidos educativos por nivel |
| `activity-extras.ts` | Cuatro desafíos contextuales adicionales por actividad |
| `learning-sequences.ts` | Secuencias fijas de cinco pasos y validación del progreso |
| `scene-world.ts` | Escenarios de 14 etapas y seis estaciones enlazadas por ID |
| `pet-visuals.ts` | Identidad visual de siete mascotas y cuadros de evolución |

## Reglas al editar contenido

1. Los IDs de las actividades deben ser únicos y estables: el guardado los utiliza.
2. Cada actividad debe enlazar escenario, nombre, icono y **cinco pasos pertinentes al mismo tema**.
3. Cada pregunta debe tener respuesta inequívoca, pista y explicación; no basta variar palabras superficiales.
4. No cambiar el orden persistido de los pasos `0..4` sin una estrategia de compatibilidad.
5. No adjudicar UPE/PA/CR en estos archivos: el motor valida y calcula las recompensas.
6. Los valores de juego son ficticios; no representan disposiciones oficiales del SNII.

Consulta [pedagogía y estaciones](../../docs/02-juego/PEDAGOGIA_Y_ESTACIONES.md) y [estado actual](../../docs/01-proyecto/ESTADO_ACTUAL.md). Tras un cambio, ejecuta `npm run typecheck` y `npm test`.
