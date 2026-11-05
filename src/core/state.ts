/**
 * @module state
 * Esquema del guardado en IndexedDB y en las exportaciones JSON.
 * CAMBIOS INCOMPATIBLES: requieren elevar `schemaVersion`, migración y pruebas.
 * Todo campo debe seguir siendo serializable; no introducir Date, DOM o funciones.
 * Ver validateSave() en persistence.ts y el esquema descrito en docs/11_GUIA_DE_CODIGO.md.
 */
/** Necesidades cuantitativas en escala 0–100; `stress` es perjudicial al subir. */
export interface NeedsState { energy:number; motivation:number; concentration:number; wellbeing:number; stress:number; curiosity:number; competence:number; socialization:number; scientificIntegrity:number }
/** Identidad persistente; `stageId` cambia al progresar, `appearanceId` representa área. */
export interface PetState { id:string; name:string; stageId:string; appearanceId:string; needs:NeedsState }
/** Elección pendiente: debe resolverse antes de permitir otra actividad académica. */
export interface GameEvent { id:string; title:string; body:string; options:readonly {id:string;label:string;credits:number;stress:number;pe:number}[] }
/**
 * Partida activa: una sola unidad de lectura/escritura transaccional.
 * `revision` se incrementa en persistence.ts después de ejecutar el motor.
 * `apRegenRemainder` conserva fracciones entre pulsos de recuperación.
 * `normativeVersionId`="unverified" impide tratar el balance como normativa oficial.
 */
/** Riesgo de deserción ficticia acumulado solo durante crisis combinadas. */
export interface AcademicRisk { criticalHours:number; alerts:number; dropoutAt:string|null; reason:string|null }
export interface GameSave {
 gameId:string; schemaVersion:number; contentVersion:string; balanceVersion:string; normativeVersionId:string;
 revision:number; createdAt:string; lastProcessedSimTime:string;
 pet:PetState; areaId:string; difficultyId:string; stageIndex:number; generation:number;
 ap:number; apRegenRemainder?:number; risk?:AcademicRisk; credits:number; stageXp:number; totalXp:number; evidence:number; completedProjects:number;
 projectProgress:number; projectName:string; actions:number; lastActivity:string; streak:number;
 automation:boolean; event:GameEvent|null; eventCursor:number; achievements:string[];
 history:string[]; records:{generation:number;score:number;maxStage:number;name:string;outcome?:'legado'|'desercion'}[];
 /** Respuestas correctas por aventura, índices 0..4. Opcional para partidas previas a v0.8. */
 learningProgress?: Record<string,number[]>;
 /** IDs de actividades con primera práctica premiada, evita duplicar bono. */
 learningRewarded?: string[];
 careTimes:Record<string,number>;
}
