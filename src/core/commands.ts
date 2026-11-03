/** Contratos públicos de comandos; shared entre UI, coordinación y almacenamiento. */
export type GameId=string;
export type CommandId=string;
export interface GameCommand<TPayload>{commandId:CommandId;type:string;commandSchemaVersion:number;gameId:GameId;expectedRevision:number;payload:TPayload;issuedAt?:string;correlationId?:string}
export type CommandStatus='committed'|'rejected'|'replayed';
export interface CommandResult<TResult>{status:CommandStatus;commandId:CommandId;gameId:GameId;revisionBefore:number;revisionAfter:number;changes:string[];domainEvents:string[];warnings:string[];resultData:TResult}
export interface CommandError{code:string;message:string;details?:Record<string,unknown>;retryable:boolean;currentRevision?:number;recoveryHint?:string}
