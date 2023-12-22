import Item, { ItemType } from "../../item";

export default class Thread extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Thread, 100, 'Thread', 'So long.', 'items/materials/thread.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}