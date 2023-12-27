import Item, { ItemType } from "../../item";

export default class Gold extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Gold, 100, 'Gold',
        'Precious and most conductive material.',
        'items/materials/gold.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}