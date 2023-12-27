import Item, { ItemType } from "../../item";

export default class Ruby extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Ruby, 100, 'Ruby',
        'Mid-tier jewel.',
        'items/materials/ruby.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}