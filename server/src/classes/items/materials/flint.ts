import Item, { ItemType } from "../../item";

export default class Flint extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Flint, 100, 'Flint',
        'Sharp and spark-producing flint, perfect for starting fires and making cutting tools.',
        'items/materials/flint.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}