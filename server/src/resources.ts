import { Drop, ItemType } from "./items";
import { Transform } from "./types";
import { EventEmitter } from 'events';

export enum ResourceType{
    Tree,
    Stone,
    Iron,
    Gold
}

export class Resource{
    // pinned values
    readonly type: ResourceType;
    private x: number;
    private y: number;
    readonly maxHealth: number;
    readonly isCollidable: boolean = true;
    readonly drops: Drop[] = [];
    // dynamic values
    src: string;
    private width: number;
    private height: number;
    private health: number;
    events: EventEmitter
    constructor(type:ResourceType, x:number, y:number, maxHealth:number, src:string, size:[number, number], isCollidable:boolean, drops:Drop[]){
        this.type = type;
        this.x = x;
        this.y = y;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.src = src;
        this.width = size[0];
        this.height = size[1];
        this.isCollidable = isCollidable;
        this.drops = drops;
        this.events = new EventEmitter();
    }

    getTransform() {
        return {
            x: this.getPosition().x,
            y: this.getPosition().y,
            width: this.getScale().x,
            height: this.getScale().y
        };
    }

    toJsonObject(){
        return {
            type: this.type,
            x: this.getPosition().x,
            y: this.getPosition().y,
            maxHealth: this.maxHealth,
            isCollidable: this.isCollidable,
            drops: this.drops,
            src: this.src,
            width: this.getScale().x,
            height: this.getScale().y,
            health: this.getHealth()
        };
    }

    damage(amount:number){
        this.health -= amount;
        if(this.health <= 0){
            this.health = 0;
            this.emit('destroy');
        }
        this.emit('damageTaken', amount);
    }

    getHealth(){return this.health;}
    getPosition(){return {x: this.x, y: this.y};}
    getScale(){return {x: this.width, y: this.height};}
    setPosition(x:number, y:number){this.x = x; this.y = y;}
    setScale(width:number, height:number){this.width = width; this.height = height;}

    checkCollision(transform:Transform){
        if(this.getPosition().x < transform.x + transform.width &&
            this.getPosition().x + this.getScale().x > transform.x &&
            this.getPosition().y < transform.y + transform.height &&
            this.getPosition().y + this.getScale().y > transform.y){
            return true;
        }
        return false;
    }

    on(event:string, callback:(...args: any[]) => void){
        this.events.on(event, callback);
    }
    emit(event:string, ...args:any[]){
        this.events.emit(event, ...args);
    }
}