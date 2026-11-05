# Arquitectura técnica y contratos de módulos

## Arquitectura
Aplicación estática PWA, local-first, con módulos ES/TypeScript compilados a recursos estáticos para Netlify. IndexedDB almacena la partida; localStorage se reserva para preferencias pequeñas; Cache Storage mantiene recursos PWA. No se necesita servidor propio para el núcleo.

## Capas
1. Interfaz: muestra el estado y emite comandos.
2. Coordinador: valida comandos, ejecuta motores, valida invariantes y confirma transacciones.
3. Motores: necesidades, acciones, proyectos, progresión, economía, combos, automatización, tiempo y eventos.
4. Datos: etapas, contenido, activos y normativa.
5. Persistencia: guardado, migraciones, exportación, importación y recuperación.
6. PWA: instalación, caché y actualización.

## Módulos
- `app-shell`: arranque, navegación y errores globales.
- `ui-pet`: mascota, sprites y animaciones.
- `ui-dashboard`: necesidades y recursos.
- `ui-activities`: catálogo de actividades y envío de comandos.
- `ui-career`: etapas, rutas, competencias y transiciones.
- `ui-dossier`: proyectos, evidencias y referencias.
- `ui-events`: sucesos y decisiones.
- `ui-legacy`: récords y generaciones.
- `engine-needs`: necesidades y bienestar.
- `engine-actions`: ejecución de actividades.
- `engine-projects`: proyectos y entregables.
- `engine-progression`: elegibilidad y transiciones ficticias.
- `engine-economy`: CR, inventario y movimientos.
- `engine-combos`: cadenas con límites.
- `engine-automation`: tareas, herramientas y mantenimiento.
- `engine-time`: tiempo y progreso offline.
- `engine-events`: selección y resolución de eventos.
- `data-stages`: las 14 etapas.
- `data-content`: actividades, eventos, objetos y logros.
- `data-normative`: metadatos de fuentes, reglas y verificación.
- `persistence`: IndexedDB y backups.
- `pwa-shell`: manifiesto y service worker.

## Modelos
- `GameSave`: versión de esquema, contenido, balance y normativa; revisión; marcas de tiempo; estado.
- `PetState`: nombre, etapa, necesidades, competencias, apariencia y personalidad.
- `CareerState`: etapa, ruta, hitos y competencias.
- `ProjectState`: fases, entregables, revisiones y evidencias.
- `EconomyState`: saldo, inventario y libro de movimientos.
- `GameHistory`: acciones, decisiones, récords y transiciones.
- `CommandRecord`: commandId, tipo, carga normalizada, estado y resultado.

## Contrato común
Todo comando de escritura incluye `commandId`, `type`, `commandSchemaVersion`, `gameId` cuando corresponda, `expectedRevision` y `payload`. El resultado incluye `status`, revisión anterior/nueva, cambios, eventos derivados, avisos y resultado específico.

## Idempotencia
- Un reintento de la misma intención usa la misma clave y carga.
- Una intención nueva usa una clave nueva.
- Misma clave con carga distinta: `IDEMPOTENCY_KEY_REUSE`.
- Cambios de una acción se confirman de forma atómica.
- Los registros críticos de idempotencia se conservan mientras viva la partida.
- Los intervalos temporales tienen identificadores únicos.
- Los eventos se publican solo después de confirmar la transacción.

## Errores comunes
`UNKNOWN_COMMAND`, `INVALID_COMMAND_SCHEMA`, `INVALID_PARAMETER`, `UNAUTHORIZED_OPERATION`, `IDEMPOTENCY_KEY_REUSE`, `DUPLICATE_COMMAND`, `STATE_CONFLICT`, `INVARIANT_VIOLATION`, `CONFIGURATION_ERROR`, `CONTENT_VERSION_UNAVAILABLE`, `PERSISTENCE_ERROR`, `STORAGE_QUOTA_EXCEEDED`, `TIME_INCONSISTENCY`, `NORMATIVE_UNVERIFIED`, `OPERATION_NOT_ALLOWED`.

## Reglas de seguridad
- No ejecutar código arbitrario desde eventos o importaciones.
- Validar los archivos importados y limitar tamaño y estructura.
- No exponer herramientas administrativas en la UI normal.
- No usar datos sensibles ni exigir cuenta para la primera versión.
- No confiar en la hora del cliente como autoridad única del progreso offline.
