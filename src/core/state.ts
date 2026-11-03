/** Estado serializable de partida; nunca incluimos funciones ni código de usuarios. */
export interface NeedsState { energy:number; motivation:number; concentration:number; wellbeing:number; stress:number; curiosity:number; competence:number; socialization:number; scientificIntegrity:number }
export interface PetState { id:string; name:string; stageId:string; appearanceId:string; needs:NeedsState }
export interface GameEvent { id:string; title:string; body:string; options:readonly {id:string;label:string;credits:number;stress:number;pe:number}[] }
export interface GameSave {
 gameId:string; schemaVersion:number; contentVersion:string; balanceVersion:string; normativeVersionId:string;
 revision:number; createdAt:string; lastProcessedSimTime:string;
 pet:PetState; areaId:string; difficultyId:string; stageIndex:number; generation:number;
 ap:number; credits:number; stageXp:number; totalXp:number; evidence:number; completedProjects:number;
 projectProgress:number; projectName:string; actions:number; lastActivity:string; streak:number;
 automation:boolean; event:GameEvent|null; eventCursor:number; achievements:string[];
 history:string[]; records:{generation:number;score:number;maxStage:number;name:string}[];
 careTimes:Record<string,number>;
}
