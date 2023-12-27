import Item, { ItemType } from "../../item";

export default class Titanium extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Titanium, 100, 'Titanium',
        'Strong and corrosion-resistant material.',
        'items/materials/titanium.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}