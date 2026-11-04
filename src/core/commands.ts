/**
 * @module commands
 * Contratos de escritura compartidos por interfaz, coordinador y almacenamiento.
 * Un comando tiene una identidad estable (`commandId`) y una revisión esperada:
 * son las dos claves de idempotencia y control de concurrencia en IndexedDB.
 * No colocar aquí lógica de juego ni efectos secundarios.
 */
export type GameId=string;
export type CommandId=string;
/** Orden de escritura: reusar el mismo ID solo si se reintenta exactamente la misma orden. */
export interface GameCommand<TPayload>{commandId:CommandId;type:string;commandSchemaVersion:number;gameId:GameId;expectedRevision:number;payload:TPayload;issuedAt?:string;correlationId?:string}
/** `replayed` implica que no se ejecutaron otra vez recompensas ni transiciones. */
export type CommandStatus='committed'|'rejected'|'replayed';
/** Confirmación de operación. Las notificaciones al usuario derivan de `changes`. */
export interface CommandResult<TResult>{status:CommandStatus;commandId:CommandId;gameId:GameId;revisionBefore:number;revisionAfter:number;changes:string[];domainEvents:string[];warnings:string[];resultData:TResult}
/** Errores recuperables incluyen conflictos por otra pestaña (`STATE_CONFLICT`). */
export interface CommandError{code:string;message:string;details?:Record<string,unknown>;retryable:boolean;currentRevision?:number;recoveryHint?:string}
