import { generateUUID, EventEmitter } from "./utils";

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

    constructor(type:ItemType, maxStack:number, name:string, description:string, src:string, offsetX:number, offsetY:number, rotation:number, width:number, height:number, quantity:number = 1, uuid?:string){
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

        this.uuid = uuid != undefined ? uuid : generateUUID();
        this.events = new EventEmitter();
        this.quantity = quantity;
    }

    on(event:string, listener:(...args: any[]) => void){
        this.events.on(event, listener);
    }

    emit(event:string, ...args:any[]){
        this.events.emit(event, ...args);
    }

    getSaveFormat(){
        return {
            type: this.type,
            uuid: this.uuid,
            quantity: this.quantity,
        }
    }
}

export interface ItemSaveFormat{
    type:ItemType;
    uuid:string;
    quantity:number;
}

export enum ItemType{
    // Tool
    // Equipment
    // Consumable
    // Placeable
    // Materials
    Cotton = 'cotton',
    Thread = 'thread',
    Fabric = 'fabric',
    Leather = 'leather',
    Fur = 'fur',
    Fiber = 'fiber',
    Wood = 'wood',
    Thatch = 'thatch',
    Stone = 'stone',
    Flint = 'flint',
    Sand = 'sand',
    Iron = 'iron',
    Iron_Ingot = 'iron_ingot',
    Aluminum = 'aluminum',
    Copper = 'copper',
    Gold = 'gold',
    Platinum = 'platinum',
    Mithril = 'mithril',
    Adamantium = 'adamantium',
    Titanium = 'titanium',
    Topaz = 'topaz',
    Ruby = 'ruby',
    Emerald = 'emerald',
    Diamond = 'diamond',
    Meteorite = 'meteorite',
    // Others
}