import Item, { ItemType } from "../../item";

export default class Mithril extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Mithril, 100, 'Mithril',
        'There\'s mythical power in it.',
        'items/materials/mithril.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}