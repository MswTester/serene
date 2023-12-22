import Item, { ItemType } from "../../item";

export default class Thread extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Thread, 100, 'Thread',
        'Strong and versatile thread, essential for sewing and binding different materials.',
        'items/materials/thread.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}