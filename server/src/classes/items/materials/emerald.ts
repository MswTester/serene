import Item, { ItemType } from "../../item";

export default class Emerald extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Emerald, 100, 'Emerald',
        'High-tier jewel.',
        'items/materials/emerald.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}