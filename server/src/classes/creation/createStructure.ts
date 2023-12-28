import Structure, { StructureType } from "../structure";
import Wooden_Floor from "../structures/architectures/wooden_floor";

export const createStructure = (type:StructureType, x:number, y:number, ownerId?:string, ownerGuildId?:string, uuid?:string, health?:number):Structure => {
    switch(type){
        case StructureType.Wooden_Floor:
            return new Wooden_Floor(x, y, ownerId, ownerGuildId, uuid, health);
        default:
            throw new Error('Invalid Structure Type');
    }
}