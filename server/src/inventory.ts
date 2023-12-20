import { Item } from "./items";

export class Inventory{
    // pinned values
    readonly maxSlots: number = 20;
    // dynamic values
    items: Item[] = [];
    constructor(maxSlots:number = 20){
        this.maxSlots = maxSlots;
    }

    toJsonObject(){
        return {
            maxSlots: this.maxSlots,
            items: this.items.map(item => item.toJsonObject())
        };
    }

    addItem(item:Item){
        if(this.items.length >= this.maxSlots) return;
        this.items.push(item);
    }

    removeItem(item:Item){
        this.items.splice(this.items.indexOf(item), 1);
    }
}