import Item, { ItemType } from "../../item";

export default class Diamond extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Diamond, 100, 'Diamond',
        'Top-tier jewel.',
        'items/materials/diamond.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}