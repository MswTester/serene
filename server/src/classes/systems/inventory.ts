import { createItem } from "../creation/createItem";
import Item, { ItemSaveFormat } from "../item";

export default class Inventory{
    private Items:(Item|null)[] = [];

    constructor(maxSlots?:number, items?:(Item|null)[]){
        this.Items = items || this.Items;
        if(maxSlots != undefined){
            for(let i = 0; i < maxSlots; i++){
                this.Items.push(null);
            }
        }
    }

    length(){
        return this.Items.length;
    }

    add(item:Item){
        for(let i = 0; i < this.Items.length; i++){
            if(this.Items[i] == null){
                this.Items[i] = item;
                return true;
            } else if((this.Items[i] as Item).type == item.type){
                if((this.Items[i] as Item).quantity + item.quantity <= (this.Items[i] as Item).maxStack){
                    (this.Items[i] as Item).quantity += item.quantity;
                    return true;
                } else {
                    let remaining = ((this.Items[i] as Item).quantity + item.quantity) - (this.Items[i] as Item).maxStack;
                    (this.Items[i] as Item).quantity = (this.Items[i] as Item).maxStack;
                    item.quantity = remaining;
                }
            }
        }
        return false;
    }

    remove(index:number){
        if(index < this.Items.length){
            this.Items.splice(index, 1);
            return true;
        }
        return false;
    }

    setLength(length:number){
        if(length > this.Items.length){
            for(let i = this.Items.length; i < length; i++){
                this.Items.push(null);
            }
        } else if(length < this.Items.length){
            this.Items.splice(length, this.Items.length - length);
        }
    }

    getSaveFormat(){
        return this.Items.map((item) => {
            if(item == null){
                return null;
            } else {
                return item.getSaveFormat();
            }
        });
    }

    static toInventory(items:(ItemSaveFormat|null)[]){
        return new Inventory(items.length, items.map((item) => {
            if(item == null){
                return null;
            } else {
                return createItem(item.type, item.quantity, item.uuid);
            }
        }));
    }
}

export enum SlotType{
    Head = 'head',
    Chest = 'chest',
    Legs = 'legs',
    Feet = 'feet',
    Hand = 'hand',
    Back = 'back',
    MainHand = 'mainhand',
    OffHand = 'offhand',
    Ammo = 'ammo',
    Other = 'other',
}