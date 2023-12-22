import Item, { ItemType } from "../../item";

export default class Stone extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Stone, 100, 'Stone',
        'Hard and durable stone, ideal for constructing robust buildings and crafting tools.',
        'items/materials/stone.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}