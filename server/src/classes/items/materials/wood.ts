import Item, { ItemType } from "../../item";

export default class Wood extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Wood, 100, 'Wood',
        'Solid and versatile wood, essential for building structures and crafting tools.',
        'items/materials/wood.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}