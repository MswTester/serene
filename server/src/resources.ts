import { Drop, ItemType } from "./items";
import { Transform } from "./types";

export enum ResourceType{
    Tree,
    Stone,
    Iron,
    Gold
}

export class Resource{
    // pinned values
    readonly type: ResourceType;
    readonly x: number;
    readonly y: number;
    readonly maxHealth: number;
    readonly minRegenTime: number;
    readonly maxRegenTime: number;
    readonly isCollidable: boolean = true;
    readonly drops: Drop[] = [];
    // dynamic values
    src: string;
    private width: number;
    private height: number;
    private health: number;
    regenTime: number;
    constructor(type:ResourceType, x:number, y:number, maxHealth:number, src:string, minRegenTime:number, maxRegenTime:number, size:[number, number], isCollidable:boolean, drops:Drop[]){
        this.type = type;
        this.x = x;
        this.y = y;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.src = src;
        this.minRegenTime = minRegenTime;
        this.maxRegenTime = maxRegenTime;
        this.width = size[0];
        this.height = size[1];
        this.isCollidable = isCollidable;
        this.drops = drops;
    }

    toTransform() {
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
            minRegenTime: this.minRegenTime,
            maxRegenTime: this.maxRegenTime,
            isCollidable: this.isCollidable,
            drops: this.drops,
            src: this.src,
            width: this.getScale().x,
            height: this.getScale().y,
            health: this.getHealth(),
            regenTime: this.regenTime
        };
    }

    damage(amount:number){
        this.health -= amount;
        if(this.health <= 0){
            this.health = 0;
        }
    }

    getHealth(){return this.health;}
    getPosition(){return {x: this.x, y: this.y};}
    getScale(){return {x: this.width, y: this.height};}

    regen(){
        this.health = this.maxHealth;
    }

    tick(){
        if(this.health <= 0){
            this.regenTime++;
            if(this.regenTime >= Math.random() * (this.maxRegenTime - this.minRegenTime + 1)){
                this.regen();
                this.regenTime = 0;
            }
        }
    }

    checkCollision(transform:Transform){
        if(this.getPosition().x < transform.x + transform.width &&
            this.getPosition().x + this.getScale().x > transform.x &&
            this.getPosition().y < transform.y + transform.height &&
            this.getPosition().y + this.getScale().y > transform.y){
            return true;
        }
        return false;
    }
}