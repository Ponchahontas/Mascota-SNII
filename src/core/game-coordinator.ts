/** API de escritura que usa la UI. El motor puro no sabe cómo persiste cada acción. */
import type { GameSave } from './state.js';
import type { CommandError, CommandResult, GameCommand } from './commands.js';
import { commitCommand, getSave } from './persistence.js';
import type { ActionType } from './engine-game.js';
export async function issueCommand(state:GameSave,type:ActionType,payload:Record<string,unknown>={}):Promise<{result:CommandResult<null>|CommandError;save:GameSave|null}>{
 const command:GameCommand<Record<string,unknown>>={commandId:crypto.randomUUID(),commandSchemaVersion:1,gameId:state.gameId,expectedRevision:state.revision,type,payload};
 const result=await commitCommand(command);
 const save=await getSave();
 return {result,save};
}
