import Item, { ItemType } from "../../item";

export default class Iron extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Iron, 100, 'Iron',
        'Strong and malleable iron, crucial for forging advanced tools and weapons.',
        'items/materials/iron.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}