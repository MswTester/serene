import Item, { ItemType } from "../item";
import { SlotType } from "../systems/inventory";

export default class Placeable extends Item {
    readonly structure:any;
    readonly placeSpeed:number;
    readonly placeRange:number;

    constructor(type:ItemType, maxStack:number, name:string, description:string, src:string, offsetX:number, offsetY:number, rotation:number, width:number, height:number, structure:any, placeSpeed:number, placeRange:number, useSpeed:number){
        super(type, maxStack, name, description, src, offsetX, offsetY, rotation, width, height);
        this.structure = structure;
        this.placeSpeed = placeSpeed;
        this.placeRange = placeRange;
    }

    place(){
        return this.structure;
    }
}