import Item, { ItemType } from "../item";
import { SlotType } from "../systems/inventory";

export default class Equipment extends Item {
    readonly durability:number;
    readonly defense:number;
    readonly slotType:SlotType;

    durabilityMultiplier:number = 1;
    defenseMultiplier:number = 1;

    constructor(type:ItemType, maxStack:number, name:string, description:string, src:string, offsetX:number, offsetY:number, rotation:number, width:number, height:number, durability:number, defense:number, slotType:SlotType, durabilityMultiplier:number = 1, defenseMultiplier:number = 1){
        super(type, maxStack, name, description, src, offsetX, offsetY, rotation, width, height);
        this.durability = durability;
        this.defense = defense;
        this.slotType = slotType;
        this.durabilityMultiplier = durabilityMultiplier;
        this.defenseMultiplier = defenseMultiplier;
    }
}