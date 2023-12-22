import { EventEmitter } from "events";
import Item from "./item";
import { generateUUID } from "./utils";
import { ItemDrop } from "./types";

export default class Resource{
    readonly type:ResourceType;

    readonly maxHealth:number;
    readonly hardness:number;

    readonly drops:ItemDrop[];
    readonly requiredTool:Item[];

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

    constructor(type:ResourceType, maxHealth:number, hardness:number, drops:ItemDrop[], requiredTool:Item[], src:string, offsetWidth:number, offsetHeight:number, isCollidable:boolean,
        x:number, y:number, width:number, height:number){
        this.type = type;
        this.maxHealth = maxHealth;
        this.hardness = hardness;
        this.drops = drops;
        this.requiredTool = requiredTool;
        this.src = src;
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        this.isCollidable = isCollidable;

        this.uuid = generateUUID();
        this.events = new EventEmitter();
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.health = this.maxHealth;
    }

    on(event:string, listener:(...args: any[]) => void){
        this.events.on(event, listener);
    }

    emit(event:string, ...args:any[]){
        this.events.emit(event, ...args);
    }
}

export enum ResourceType{
    Oak_Tree = 'oak_tree',
    Cotton_Tree = 'cotton_tree',
    Baobab_Tree = 'baobab_tree',
    Palm_Tree = 'palm_tree',
    Stone = 'stone',
    Grass = 'grass',
    Sandstone = 'sandstone',
}