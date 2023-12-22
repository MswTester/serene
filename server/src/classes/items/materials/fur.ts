import Item, { ItemType } from "../../item";

export default class Fur extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Fur, 100, 'Fur',
        'Warm and cozy fur, great for crafting insulated clothing and luxurious decor.',
        'items/materials/fur.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}