import Item, { ItemType } from "../../item";

export default class Sand extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Sand, 100, 'Sand',
        'Can be glint.',
        'items/materials/sand.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}