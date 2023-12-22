import Item, { ItemType } from "../../item";

export default class Platinum extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Platinum, 100, 'Platinum',
        'Rare and valuable platinum, used in luxury goods and high-tech crafting.',
        'items/materials/platinum.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}