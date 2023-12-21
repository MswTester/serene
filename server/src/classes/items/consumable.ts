import Item, { ItemType } from "../item";
import { SlotType } from "../systems/inventory";

export default class Consumable extends Item {
    readonly useSpeed:number;

    speedMultiplier:number = 1;
    effectMultiplier:number = 1;

    constructor(type:ItemType, maxStack:number, name:string, description:string, src:string, offsetX:number, offsetY:number, rotation:number, width:number, height:number, useSpeed:number, speedMultiplier:number = 1, effectMultiplier:number = 1){
        super(type, maxStack, name, description, src, offsetX, offsetY, rotation, width, height);
        this.useSpeed = useSpeed;
        this.speedMultiplier = speedMultiplier;
        this.effectMultiplier = effectMultiplier;
    }

    use(){
        return this.effectMultiplier;
    }
}