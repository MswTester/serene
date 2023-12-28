import { generateUUID, EventEmitter } from "./utils";

export default class Structure{
    readonly type:StructureType;
    readonly name:string;

    readonly maxHealth:number;
    readonly hardness:number;
    readonly defense:number;

    readonly src:string;
    readonly offsetWidth:number;
    readonly offsetHeight:number;
    readonly isCollidable:boolean;

    uuid:string;
    events:EventEmitter;

    x:number;
    y:number;
    width:number;
    height:number;

    health:number;

    ownerId:string;
    ownerGuildId:string;

    constructor(type:StructureType, name:string, maxHealth:number, hardness:number, defense:number, src:string, offsetWidth:number, offsetHeight:number, isCollidable:boolean,
        x:number, y:number, width:number, height:number, ownerId?:string, ownerGuildId?:string, uuid?:string, health?:number){
        this.type = type;
        this.name = name;
        this.maxHealth = maxHealth;
        this.hardness = hardness;
        this.defense = defense;
        this.src = src;
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        this.isCollidable = isCollidable;

        this.uuid = uuid != undefined ? uuid : generateUUID();
        this.events = new EventEmitter();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health != undefined ? health : this.maxHealth;
        this.ownerId = ownerId != undefined ? ownerId : "";
        this.ownerGuildId = ownerGuildId != undefined ? ownerGuildId : "";
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
            x: this.x,
            y: this.y,
            health: this.health,
            ownerId: this.ownerId,
            ownerGuildId: this.ownerGuildId
        }
    }
}

export interface StructureSaveFormat{
    type:StructureType;
    uuid:string;
    x:number;
    y:number;
    health:number;
    ownerId:string;
    ownerGuildId:string;
}

export enum StructureType{
    // Craftable
    Workbench = 'workbench',
    // architecture
    Wooden_Wall = 'wooden_wall',
    Wooden_Door = 'wooden_door',
    Wooden_Floor = 'wooden_floor',
    // furniture
    Bed = 'bed',
    Chest = 'chest',
    // other
}