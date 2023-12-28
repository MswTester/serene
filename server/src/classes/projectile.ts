import { generateUUID, EventEmitter } from "./utils";

export default class Projectile{
    readonly type:ProjectileType;
    
    readonly maxDistance:number;
    readonly damage:number;

    readonly src:string;
    readonly offsetWidth:number;
    readonly offsetHeight:number;

    uuid:string;
    events:EventEmitter;

    x:number;
    y:number;
    dx:number;
    dy:number;
    rotation:number;
    width:number;
    height:number;

    ownerId:string;
    damageMultiplier:number;

    constructor(type:ProjectileType, maxDistance:number, damage:number, src:string, offsetWidth:number, offsetHeight:number,
        x:number, y:number, dx:number, dy:number, rotation:number, width:number, height:number, ownerId?:string, damageMultiplier?:number, uuid?:string){
        this.type = type;
        this.maxDistance = maxDistance;
        this.damage = damage;
        this.src = src;
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;

        this.uuid = uuid != undefined ? uuid : generateUUID();
        this.events = new EventEmitter();
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.rotation = rotation;
        this.width = width;
        this.height = height;
        this.ownerId = ownerId || '';
        this.damageMultiplier = damageMultiplier || 1;
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
            rotation: this.rotation,
            ownerId: this.ownerId,
            damageMultiplier: this.damageMultiplier,
        }
    }
}

export interface ProjectileSaveFormat{
    type:ProjectileType;
    uuid:string;
    x:number;
    y:number;
    dx:number;
    dy:number;
    rotation:number;
    ownerId:string;
    damageMultiplier:number;
}

export enum ProjectileType{
    // Bullet
    // Arrow
    Arrow = 'arrow', // default stone arrow
    // Rocket
    // Grenade
    // Others
}