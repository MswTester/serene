import { Inventory } from "./inventory";
import { CustomItemOptions, ItemType } from "./items";
import { Drop } from "./items";
import { Transform } from "./types";

export interface CustomEntityOptions {
    itemQuantity?: number;
    itemType?: ItemType;
    itemName?: string;
    itemDescription?: string;
    itemMaxStack?: number;
    itemOptions?: CustomItemOptions;
    speed?: number;
    collisionEvent?: Function;
    drops?: Drop[];
    inventory?: Inventory;
}

export enum EntityType {
    Player,
    Enemy,
    Projectile,
    Item,
}

export class Entity {
    // pinned values
    readonly type: EntityType;
    readonly maxHealth: number = 0;
    readonly options: CustomEntityOptions = {};
    // dynamic values
    src: string = '';
    private x: number = 0;
    private y: number = 0;
    private dx: number = 0;
    private dy: number = 0;
    private width: number = 0;
    private height: number = 0;
    private health: number = 0;
    constructor(type:EntityType, x:number, y:number, maxHealth:number, src:string, size:[number, number], options?:CustomEntityOptions){
        this.type = type;
        this.x = x;
        this.y = y;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.src = src;
        this.width = size[0];
        this.height = size[1];
        this.options = options || {};
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
            maxHealth: this.maxHealth,
            options: this.options,
            src: this.src,
            x: this.getPosition().x,
            y: this.getPosition().y,
            dx: this.getVelocity().dx,
            dy: this.getVelocity().dy,
            width: this.getScale().x,
            height: this.getScale().y,
            health: this.getHealth()
        };
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

    damage(amount:number){
        this.health -= amount;
        if(this.health <= 0){
            this.health = 0;
        }
    }

    getHealth(){return this.health;}
    getPosition(){return {x: this.x, y: this.y};}
    getVelocity(){return {dx: this.dx, dy: this.dy};}
    getScale(){return {x: this.width, y: this.height};}

    tick(){
        this.move();
    }

    move(){
        this.x += this.getVelocity().dx;
        this.y += this.getVelocity().dy;
    }
}