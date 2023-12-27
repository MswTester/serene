import Item, { ItemType } from "../../item";

export default class Iron_Ingot extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Iron_Ingot, 100, 'Iron_Ingot',
        'Useful for crafting tools and weapons.',
        'items/materials/iron_ingot.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}