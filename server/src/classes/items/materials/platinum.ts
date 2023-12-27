import Item, { ItemType } from "../../item";

export default class Platinum extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Platinum, 100, 'Platinum',
        'Rare and valuable.',
        'items/materials/platinum.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}