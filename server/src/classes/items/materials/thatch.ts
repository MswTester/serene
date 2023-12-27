import Item, { ItemType } from "../../item";

export default class Thatch extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Thatch, 100, 'Thatch',
        'A bundle of dried grass.',
        'items/materials/thatch.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid)
    }
}