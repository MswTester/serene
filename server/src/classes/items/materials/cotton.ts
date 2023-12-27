import Item, { ItemType } from "../../item";

export default class Cotton extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Cotton, 100, 'Cotton',
        'Very soft and fluffy.',
        'items/materials/cotton.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}