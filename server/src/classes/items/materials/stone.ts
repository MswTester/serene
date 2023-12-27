import Item, { ItemType } from "../../item";

export default class Stone extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Stone, 100, 'Stone',
        'Heavy and hard.',
        'items/materials/stone.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}