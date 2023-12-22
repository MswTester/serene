import Item, { ItemType } from "../../item";

export default class Adamantium extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Adamantium, 100, 'Adamantium',
        'Near-indestructible adamantium, the ultimate material for top-tier weaponry and armor.',
        'items/materials/adamantium.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}