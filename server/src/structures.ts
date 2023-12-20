import { Inventory } from "./inventory";
import { Transform } from "./types";
import { EventEmitter } from 'events';

export interface CustomStructureOptions {
    collisionEvent?: Function;
    inventory?: Inventory;
}

export enum structureType {
    Wall = 'Wall',
    Door = 'Door',
    Chest = 'Chest',
    Furnace = 'Furnace',
    Workbench = 'Workbench',
    CraftingTable = 'CraftingTable',
    Anvil = 'Anvil',
    EnchantmentTable = 'EnchantmentTable',
    Bookshelf = 'Bookshelf',
    Bed = 'Bed',
    Campfire = 'Campfire',
    Custom = 'Custom',
}

export class Structure {
    // pinned values
    readonly type: structureType;
    readonly maxHealth: number = 0;
    readonly src: string = '';
    readonly isCollidable: boolean = true;
    readonly hardness: number = 0;
    readonly options: CustomStructureOptions = {};
    // dynamic values
    private x: number = 0;
    private y: number = 0;
    private width: number = 0;
    private height: number = 0;
    private health: number = 0;
    events: EventEmitter
    constructor(type: structureType, x: number, y: number, maxHealth: number, src: string, size: [number, number], hardness:number, isCollidable: boolean, options?: CustomStructureOptions) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.maxHealth = maxHealth;
        this.health = this.maxHealth;
        this.src = src;
        this.width = size[0];
        this.height = size[1];
        this.hardness = hardness;
        this.isCollidable = isCollidable;
        this.options = options || {};
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

    toJsonObject() {
        return {
            type: this.type,
            maxHealth: this.maxHealth,
            src: this.src,
            isCollidable: this.isCollidable,
            options: this.options,
            x: this.getPosition().x,
            y: this.getPosition().y,
            width: this.getScale().x,
            height: this.getScale().y,
            hardness: this.hardness,
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

    damage(amount: number) {
        this.health -= amount;
        if(this.health <= 0){
            this.health = 0;
            this.emit('destroy');
        }
        this.emit('damageTaken', amount);
    }

    getHealth() { return this.health; }
    getPosition() { return { x: this.x, y: this.y }; }
    getScale() { return { x: this.width, y: this.height }; }

    on(event:string, callback:(...args: any[]) => void){
        this.events.on(event, callback);
    }
    emit(event:string, ...args:any[]){
        this.events.emit(event, ...args);
    }
}