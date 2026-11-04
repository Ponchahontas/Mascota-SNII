/**
 * @module game-coordinator
 * Adaptador de UI a transacciones de dominio.
 * Crea un `commandId` nuevo por interacción; en un reintento de RED debe
 * reusarse el mismo ID (el MVP no implementa ese mecanismo todavía).
 * Devuelve el guardado actualizado: no mutar el snapshot previo desde la UI.
 */
import type { GameSave } from './state.js';
import type { CommandError, CommandResult, GameCommand } from './commands.js';
import { commitCommand, getSave } from './persistence.js';
import type { ActionType } from './engine-game.js';
/**
 * Solicita una operación a IndexedDB y lee el estado confirmado al terminar.
 * @param state Snapshot visto por la interfaz, incluida su revisión.
 * @param type Operación declarada en el motor de juego.
 * @param payload Argumentos serializables de esa operación.
 * @returns Resultado confirmado o error y copia actual de la partida.
 */
export async function issueCommand(state:GameSave,type:ActionType,payload:Record<string,unknown>={}):Promise<{result:CommandResult<null>|CommandError;save:GameSave|null}>{
 const command:GameCommand<Record<string,unknown>>={commandId:crypto.randomUUID(),commandSchemaVersion:1,gameId:state.gameId,expectedRevision:state.revision,type,payload};
 const result=await commitCommand(command);
 const save=await getSave();
 return {result,save};
}
