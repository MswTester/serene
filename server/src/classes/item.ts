import { EventEmitter } from "events";
import { generateUUID } from "./utils";

export default class Item{
    readonly type:ItemType;
    readonly maxStack:number;
    readonly name:string;
    readonly description:string;

    readonly src:string;
    readonly offsetX:number;
    readonly offsetY:number;
    readonly rotation:number;
    readonly width:number;
    readonly height:number;

    uuid:string;
    events:EventEmitter;

    quantity:number = 1;

    constructor(type:ItemType, maxStack:number, name:string, description:string, src:string, offsetX:number, offsetY:number, rotation:number, width:number, height:number, quantity:number = 1){
        this.type = type;
        this.maxStack = maxStack;
        this.name = name;
        this.description = description;
        this.src = src;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.rotation = rotation;
        this.width = width;
        this.height = height;

        this.uuid = generateUUID();
        this.events = new EventEmitter();
        this.quantity = quantity;
    }

    on(event:string, listener:(...args: any[]) => void){
        this.events.on(event, listener);
    }

    emit(event:string, ...args:any[]){
        this.events.emit(event, ...args);
    }
}

export enum ItemType{
    // Tool
    // Equipment
    // Consumable
    // Placeable
    // Others
    Wood = 'wood',
}

export interface ItemDrop{
    item:new (...args: any[]) => Item;
    chance:number;
    min:number;
    max:number;
}