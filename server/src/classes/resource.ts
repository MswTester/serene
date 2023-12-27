import { EventEmitter } from "events";
import Item, { ItemType } from "./item";
import { generateUUID } from "./utils";

export default class Resource{
    readonly type:ResourceType;

    readonly maxHealth:number;
    readonly hardness:number;

    readonly drops:ItemDrop[];
    readonly requiredTool:ItemType[];

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

    constructor(type:ResourceType, maxHealth:number, hardness:number, drops:ItemDrop[], requiredTool:ItemType[], src:string, offsetWidth:number, offsetHeight:number, isCollidable:boolean,
        x:number, y:number, width:number, height:number, uuid?:string, health?:number){
        this.type = type;
        this.maxHealth = maxHealth;
        this.hardness = hardness;
        this.drops = drops;
        this.requiredTool = requiredTool;
        this.src = src;
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        this.isCollidable = isCollidable;

        this.uuid = uuid || generateUUID();
        this.events = new EventEmitter();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = health != undefined ? health : this.maxHealth;
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
        }
    }
}

export interface ResourceSaveFormat{
    type:ResourceType;
    uuid:string;
    x:number;
    y:number;
    health:number;
}

export enum ResourceType{
    Oak_Tree = 'oak_tree',
    Cotton_Tree = 'cotton_tree',
    Palm_Tree = 'palm_tree',
    Rock = 'rock',
    Grass = 'grass',
    Sandstone = 'sandstone',
    Vine = 'vine',
    Cactus = 'cactus',
}