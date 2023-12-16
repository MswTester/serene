import { Entity, EntityType } from "./entities";

export interface CustomItemOptions {
    use?: Function;
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
    Wood,
    Stone,
    Thatch,
    Fiber,
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
    constructor(type: ItemType, src: string, name: string, description: string, maxStack:number, amount: number, options?: CustomItemOptions) {
        this.type = type;
        this.src = src;
        this.name = name;
        this.description = description;
        this.maxStack = maxStack;
        this.amount = amount;
        this.options = options || {};
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

    use() {
        if (this.options.use) {
            this.options.use();
        }
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