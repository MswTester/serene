import Item, { ItemType } from "../../item";

export default class Leather extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Leather, 100, 'Leather', 'Tight thing.', 'items/materials/leather.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}