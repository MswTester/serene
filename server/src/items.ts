import { Entity, EntityType } from "./entities";
import { EventEmitter } from "events";

export interface CustomItemOptions {
    use?: string; // function name
}

export const useFunctionMap: {[key:string]:Function} = {
    'wood': () => {
        console.log('used wood');
    }
}

export interface Drop{
    type: ItemType;
    name: string;
    description: string;
    maxStack: number;
    minAmount: number;
    maxAmount: number;
}

export enum ItemType {
    // Resources
    Wood = 'Wood',
    Stone = 'Stone',
    Thatch = 'Thatch',
    Fiber = 'Fiber',
}

export class Item {
    // pinned values
    readonly type: ItemType;
    readonly maxStack: number = 100;
    readonly options: CustomItemOptions = {};
    // dynamic values
    name: string;
    description: string;
    src: string;
    amount: number;
    events: EventEmitter
    constructor(type: ItemType, src: string, name: string, description: string, maxStack:number, amount: number, options?: CustomItemOptions) {
        this.type = type;
        this.src = src;
        this.name = name;
        this.description = description;
        this.maxStack = maxStack;
        this.amount = amount;
        this.options = options || {};
        this.events = new EventEmitter();
    }

    toJsonObject() {
        return {
            type: this.type,
            maxStack: this.maxStack,
            options: this.options,
            name: this.name,
            description: this.description,
            src: this.src,
            amount: this.amount
        };
    }

    on(event:string, callback:(...args: any[]) => void){
        this.events.on(event, callback);
    }
    emit(event:string, ...args:any[]){
        this.events.emit(event, ...args);
    }

    drop(amount: number):Entity {
        this.amount -= amount;
        return new Entity(EntityType.Item, 0, 0, 1, this.src, [16, 16],{
            itemType: this.type,
            itemName: this.name,
            itemDescription: this.description,
            itemQuantity: amount,
            itemMaxStack: this.maxStack,
            itemOptions: this.options
        });
    }
}