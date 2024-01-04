import Player from "../creatures/others/player";
import Creature, { CreatureType } from "../creature";
import Chilia from "../creatures/friendly/chilia";
import { ItemSaveFormat } from "../item";

export const createCreature = (type:CreatureType, x:number, y:number, level:number, exp:number,
    uuid?:string, dx?:number, dy?:number, direction?:Direction,
    state?:string, health?:number, food?:number,
    inventory?:(ItemSaveFormat|null)[], isTamed?:boolean, ownerId?:string, ownerGuildId?:string,
    guildId?:string, name?:string):Creature => {
    switch(type){
        case CreatureType.Chilia:
            return new Chilia(x, y, level, exp, uuid, dx, dy, direction, state, health, food, inventory, isTamed, ownerId, ownerGuildId);
        case CreatureType.Player:
            return new Player(x, y, level, exp, name, uuid, dx, dy, direction, state, health, food, inventory, guildId);
        default:
            throw new Error('Invalid creature type.');
    }
}