import Item, { ItemType } from "../../item";

export default class Copper extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Copper, 100, 'Copper',
        'More conductive and malleable.',
        'items/materials/copper.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}