import Creature, { CreatureType } from "../creature";
import Chilia from "../creatures/friendly/chilia";
import { ItemSaveFormat } from "../item";
import { Direction } from "../types";

export const createCreature = (type:CreatureType, x:number, y:number, level:number, exp:number,
    uuid?:string, dx?:number, dy?:number, direction?:Direction,
    state?:string, health?:number, food?:number,
    inventory?:(ItemSaveFormat|null)[], isTamed?:boolean, ownerId?:string, ownerGuildId?:string):Creature => {
    switch(type){
        case CreatureType.Chilia:
            return new Chilia(x, y, level, exp, uuid, dx, dy, direction, state, health, food, inventory, isTamed, ownerId, ownerGuildId);
    }
}