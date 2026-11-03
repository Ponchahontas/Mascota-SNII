# Catálogo de comandos v1.0

Todos los nombres son contratos propuestos, aún no implementados.

## Partida y mascota
- `game.create`: `petName`, `profileId`, `difficultyId`, `contentVersion` → `gameId`, revisión inicial y estado.
- `game.activate`: `gameId` → snapshot cargado.
- `game.archive`: `gameId`, `reason` → partida archivada.
- `pet.rename`: `petName` → nombre actualizado.
- `pet.setAppearance`: `appearanceId` → apariencia seleccionada.
- `game.repair`: `recoveryCaseId` → estado recuperado o diagnóstico.

## Actividades y cuidado
- `activity.execute`: `activityId`, `projectId?`, `targetId?`, `options?` → costes, recompensas, necesidades, avance y eventos.
- `care.perform`: `careActionId`, `duration?` → necesidades y coste.
- `needs.evaluate`: snapshot/contexto → alertas y recomendaciones, sin efectos.
- `needs.applyElapsed`: `intervalId`, `elapsedSimulatedTime` → recuperación/desgaste aplicado una vez.

## Proyectos y evidencias
- `project.create`: `projectTypeId`, `title`, `pathId?` → `projectId`.
- `project.updateMetadata`: `projectId`, campos editables → metadatos actualizados.
- `project.advance`: `projectId`, `activityResultId` → avance.
- `project.submit`: `projectId`, `deliverableId` → entrega registrada.
- `project.requestReview`: `projectId`, `reviewTypeId` → revisión pendiente.
- `project.resolveReview`: `reviewId`, resultado generado → dictamen ficticio.
- `project.pause` / `project.resume`: `projectId` → estado actualizado.
- `project.archive`: `projectId`, `reason?` → archivo sin borrar historia.
- `evidence.validate`: `evidenceId` → estado de validación.

## Carrera
- `career.selectPath`: `pathId` → ruta.
- `career.evaluateTransition`: `targetStageId?` → `evaluationId`, requisitos.
- `career.confirmTransition`: `targetStageId`, `evaluationId` → transición.
- `career.evaluateCompetencies`: `stageId?`, `competencyIds?` → competencias.
- `career.claimMilestoneReward`: `milestoneId` → recompensa de hito.
- `career.getHistory`: filtros → historial.

## Economía
- `economy.purchase`: `itemId`, `quantity`, `priceQuoteId` → compra y movimiento.
- `economy.claimReward`: `rewardId` → recompensa elegible.
- `economy.grantSystemReward`: `rewardId`, `causeId` → recompensa autorizada.
- `economy.getLedger`: filtros → libro de movimientos.
- `economy.getInventory`: categoría? → inventario.
- `economy.getQuote`: `itemId`, `quantity` → cotización.

## Automatización
- `automation.activate` / `automation.deactivate`: `automationId` → estado.
- `automation.upgrade`: `automationId`, `upgradeId`, `priceQuoteId` → mejora.
- `automation.assignTask`: `automationId`, `taskId`, opciones → tarea asignada.
- `automation.unassignTask`: `automationId`, `taskId` → tarea desasignada.
- `automation.getStatus`: `automationId?` → estado.
- `automation.processMaintenance`: `intervalId` → mantenimiento procesado una vez.

## Eventos
- `event.getActive`: `eventId?` → evento activo.
- `event.resolve`: `eventId`, `optionId` → decisión y efectos.
- `event.dismiss`: `eventId`, `dismissalPolicyId` → cierre autorizado.
- `event.evaluateEligibility`: `evaluationContextId` → eventos elegibles.
- `event.generate`: `evaluationId`, `selectionKey` → evento o vacío.
- `event.expire`: `eventId`, `intervalId` → caducidad.

## Tiempo
- `time.processElapsed`: `intervalId`, `fromSimTime`, `toSimTime` → intervalo procesado.
- `time.processOffline`: `absenceId`, `lastProcessedMarker` → resumen de ausencia.
- `time.getPreview`: duración y estado → previsión.
- `time.setSimulationMode`: `modeId`, justificación → modo de pruebas (solo administración).

## Logros y legado
- `achievement.evaluate`: contexto → logros desbloqueados.
- `achievement.claim`: `achievementId` → recompensa.
- `legacy.preview`: `gameId`, `legacyProfileId?` → previsualización.
- `legacy.commit`: `gameId`, `legacyProfileId`, `confirmationToken` → legado.
- `legacy.startGeneration`: `legacyId`, `newPetName`, `generationProfileId` → nueva partida.
- `legacy.getRecords`: filtros → récords.
- `legacy.exportRecord`: `legacyId`, `exportFormat` → exportación.

## Preferencias y persistencia
- `preferences.update`: `settingsPatch` → preferencias.
- `preferences.reset`: `confirmationToken` → valores iniciales.
- `preferences.get`: sin parámetros → preferencias.
- `save.commit`: `gameId`, `revision`, `snapshotId` → confirmación de guardado.
- `save.createCheckpoint`: `gameId`, `checkpointReason` → `checkpointId`.
- `save.list`: filtros → partidas.
- `save.getStatus`: `gameId` → estado.
- `save.export`: `gameId`, `exportFormat` → exportación.
- `save.import`: `importArtifact`, `importMode` → partida importada validada.
- `save.restoreBackup`: `gameId`, `backupId`, `confirmationToken` → restauración.
- `save.delete`: `gameId`, `confirmationToken` → eliminación según política.

## Normativa
- `normative.getCatalog`: versión/filtros → catálogo.
- `normative.getSource`: `sourceId` → metadatos y verificación.
- `normative.getRule`: `ruleId` → regla y trazabilidad.
- `normative.evaluateApplicability`: `ruleId`, `contextProfileId`, `referenceDate` → aplicabilidad y advertencias.
- `normative.installDataset`: `datasetArtifact`, `datasetVersionId` → dataset instalado.
- `normative.validateDataset`: `datasetVersionId` → informe.
- `normative.markReviewed`: `sourceId`, `reviewEvidenceId`, `verificationStatus` → revisión registrada.

## Consultas generales
`game.getSnapshot`, `game.getRevision`, `pet.getStatus`, `activity.getCatalog`, `activity.getQuote`, `project.getList`, `project.getDetails`, `career.getStage`, `career.getAvailableTransitions`, `economy.getSummary`, `automation.getCatalog`, `event.getHistory`, `achievement.getList`, `legacy.getSummary`, `settings.getConfiguration`.

## Comandos internos
`system.validateCommand`, `system.evaluateInvariants`, `system.publishDomainEvents`, `system.migrateSave`, `system.validateConfiguration`, `system.reconcileState`, `system.processScheduledTasks`, `system.recordDiagnostic`, `system.checkContentCompatibility`.

## Errores
Códigos comunes: `UNKNOWN_COMMAND`, `INVALID_COMMAND_SCHEMA`, `INVALID_PARAMETER`, `UNAUTHORIZED_OPERATION`, `IDEMPOTENCY_KEY_REUSE`, `DUPLICATE_COMMAND`, `STATE_CONFLICT`, `INVARIANT_VIOLATION`, `CONFIGURATION_ERROR`, `CONTENT_VERSION_UNAVAILABLE`, `PERSISTENCE_ERROR`, `STORAGE_QUOTA_EXCEEDED`, `TIME_INCONSISTENCY`, `NORMATIVE_UNVERIFIED`, `OPERATION_NOT_ALLOWED`.

## Ejemplos de idempotencia
- Reintento de una acción confirmada: mismo `commandId`, misma carga → respuesta original.
- Segunda acción intencional: nuevo `commandId`.
- Misma clave con carga diferente → `IDEMPOTENCY_KEY_REUSE`.
- Compra: débito y entrega en una sola transacción.
- Evento: decisión y consecuencias se confirman una sola vez.
- Offline: `absenceId` identifica un intervalo único.
