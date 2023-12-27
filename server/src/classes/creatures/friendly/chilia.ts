import Creature, { CreatureType } from "../../creature";
import { ItemSaveFormat } from "../../item";
import Inventory from "../../systems/inventory";
import { Direction, ItemDrop } from "../../types";

export default class Chilia extends Creature {
    static defaultType:CreatureType = CreatureType.Chilia;
    static defaultName:string = 'Chilia';
    static defaultSrc:string = 'creatures/friendly/chilia';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 1;
    static defaultStateTypes:string[] = ['idle', 'walk', 'run', 'attack', 'dead'];
    static defaultBaseHealth:number = 20;
    static defaultBaseDamage:number[] = [10, 20];
    static defaultBaseDefense:number = 0;
    static defaultBaseFood:number = 20;
    static defaultBaseSpeed:number[] = [0.1, 0.2];
    static defaultDrops:ItemDrop[] = [];
    static defaultWidth:number = 0.5;
    static defaultHeight:number = 0.5;

    constructor(x:number, y:number, lvl:number, exp:number, uuid?:string, dx?:number, dy?:number, direction?:Direction, state?:string, health?:number, food?:number, inventory?:(ItemSaveFormat|null)[], isTamed?:boolean, ownerId?:string, ownerGuildId?:string) {
        super(
            Chilia.defaultType,
            Chilia.defaultName,
            Chilia.defaultSrc,
            Chilia.defaultOffsetWidth,
            Chilia.defaultOffsetHeight,
            Chilia.defaultStateTypes,
            Chilia.defaultBaseHealth,
            Chilia.defaultBaseDamage,
            Chilia.defaultBaseDefense,
            Chilia.defaultBaseFood,
            Chilia.defaultBaseSpeed,
            Chilia.defaultDrops,
            x, y, dx, dy, direction,
            Chilia.defaultWidth,
            Chilia.defaultHeight,
            lvl, exp,
            uuid, state, health, food,
            Inventory.toInventory(inventory), isTamed, ownerId, ownerGuildId
        );
    }
}