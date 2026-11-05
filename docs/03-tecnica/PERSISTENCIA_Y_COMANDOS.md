# Persistencia, contratos e idempotencia

## Estado de la partida

`src/core/state.ts` define `GameSave`, identidad de mascota, necesidades, evolución, recompensas, historial y progreso educativo. `src/core/persistence.ts` valida los datos, mantiene IndexedDB y permite exportar/importar JSON.

## Escribir una acción

Los comandos incluyen tipo, `commandId`, `gameId`, `expectedRevision` y versión de contrato. Cada comando debe confirmarse de forma atómica con su resultado. Repetir una orden idéntica no puede producir créditos, UPE, logros o evidencias duplicadas. Si cambia la revisión esperada, informar conflicto en lugar de sobrescribir silenciosamente.

El repertorio implementado actualmente se encuentra en `ActionType` de `src/core/engine-game.ts`: respuesta educativa, actividad, cuidado, transición, entrega de proyecto, evento, automatización, tiempo offline, legado, nombre, área y reinicio tras deserción.

El antiguo [catálogo de comandos v1.0](../historico/04_CATALOGO_COMANDOS.md) **es una propuesta**, no una lista de endpoints disponibles.

## Puntos de especial cuidado

- **Tiempo offline**: hasta ocho horas por proceso de ausencia. Evitar que el reloj retroceda y no conceder premios dos veces.
- **Progreso educativo**: actividad identificada por ID; índices de pasos 0–4; al actualizar preguntas no perder aciertos.
- **Dificultad/riesgo**: partidas antiguas pueden carecer de campos nuevos; aplicar valores de compatibilidad antes de usarlos.
- **Importar JSON**: comprobar estructura y versión, y advertir al usuario antes de sustituir un guardado.
- **Preferencias**: separadas de reglas económicas y del estado de la partida.
- **Múltiples pestañas**: revisar conflictos de revisión.

## Prueba mínima al cambiar estructura

Ejecutar `npm run typecheck` y `npm test`. Añadir prueba de importación antigua, doble ejecución del mismo comando, revisión desactualizada, respuesta duplicada y recuperación offline. Antes de desplegar, verificar cierre y reapertura en navegador real.

Volver al [índice](../README.md).
