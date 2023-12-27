import Item, { ItemType } from "../../item";

export default class Topaz extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Topaz, 100, 'Topaz',
        'Low-tier jewel.',
        'items/materials/topaz.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}