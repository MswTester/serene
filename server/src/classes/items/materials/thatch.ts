import Item, { ItemType } from "../../item";

export default class Thatch extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Thatch, 100, 'Thatch', 'A piece of thatch.', 'items/materials/thatch.png', 0.3, 0, 0, 0.2, 0.2, quantity)
    }
}