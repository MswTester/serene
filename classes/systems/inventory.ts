import Item from "../item";

export default class Inventory{
    private Items:(Item|null)[] = [];

    constructor(maxSlots:number){
        for(let i = 0; i < maxSlots; i++){
            this.Items.push(null);
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