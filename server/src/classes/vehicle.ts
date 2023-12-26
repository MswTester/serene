import { EventEmitter } from "events";
import { Direction } from "./types";
import { generateUUID } from "./utils";

export default class Vehicle{
    readonly type:VehicleType;
    readonly name:string;

    readonly maxHealth:number;
    readonly maxFuel:number;
    readonly defense:number;

    readonly src:string;
    readonly offsetWidth:number;
    readonly offsetHeight:number;
    readonly isCollidable:boolean;

    uuid:string;
    events:EventEmitter;

    x:number;
    y:number;
    dx:number;
    dy:number;
    direction:Direction;
    width:number;
    height:number;

    health:number;
    fuel:number;

    ownerId:string;
    ownerGuildId:string;

    constructor(type:VehicleType, name:string, maxHealth:number, maxFuel:number, defense:number, src:string, offsetWidth:number, offsetHeight:number, isCollidable:boolean,
        x:number, y:number, dx:number, dy:number, direction:Direction, width:number, height:number, ownerId:string, ownerGuildId:string){
        this.type = type;
        this.name = name;
        this.maxHealth = maxHealth;
        this.maxFuel = maxFuel;
        this.defense = defense;
        this.src = src;
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        this.isCollidable = isCollidable;

        this.uuid = generateUUID();
        this.events = new EventEmitter();
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.direction = direction;
        this.width = width;
        this.height = height;
        this.health = this.maxHealth;
        this.fuel = this.maxFuel;
        this.ownerId = ownerId;
        this.ownerGuildId = ownerGuildId;
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
            dx: this.dx,
            dy: this.dy,
            direction: this.direction,
            health: this.health,
            fuel: this.fuel,
            ownerId: this.ownerId,
            ownerGuildId: this.ownerGuildId,
        }
    }
}

export enum VehicleType{
    // Car
    // Truck
    // Tank
    // Plane
    // Boat
    // Others
}