import Item, { ItemType } from "../../item";

export default class Wood extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Wood, 100, 'Wood',
        'The beginning of all things.',
        'items/materials/wood.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}