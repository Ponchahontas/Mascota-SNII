# Contratos y persistencia — versión v0.10.0

`GameSave` está en `src/core/state.ts`. La lectura/escritura se realiza en `src/core/persistence.ts` con **IndexedDB** y dos almacenes en una transacción: partida (`saves`) y comando confirmado (`commands`). Los comandos incluyen `expectedRevision` y una clave idempotente; un reintento no puede reclamar premios duplicados.

## Extensiones del juego de nueve áreas

- `areaId`: se mantienen los siete IDs anteriores y se añaden `conducta`, `interdisciplinaria`.
- `areaPath?: string`: rama elegida desde Universidad. Solo se admite una rama registrada para esa área.
- `fieldMilestones?: number[]`: índices de etapas 0–13 donde ya se otorgó bono de misión de campo, con máximo un bono por etapa **aun si se cambia de área**.
- Nuevos comandos: `career.chooseRoute`, `career.completeFieldMission`, procesados por el motor y guardados transaccionalmente.
- La validación de importación (`validateSave`) acepta la ausencia de campos nuevos en partidas antiguas; los inicializa el motor al necesitarlos.

## Reglas de seguridad

No confiar en los datos de la interfaz: el motor debe validar área, etapa, rama, solución y recompensa; importar JSON exige validación de estructura. `pet.changeArea` conserva economía, etapa y logros, pero elimina una especialización que ya no corresponde a la nueva área.

Las preguntas de las 84 aventuras usan `learningProgress[activityId]` e índices **0..4**. No reordenar IDs/índices sin migración. `fieldMilestones` es un mecanismo distinto y **no** reemplaza estos cinco aciertos.

Ver [Áreas y rutas](../02-juego/AREAS_Y_RUTAS.md).
