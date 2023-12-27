import Item, { ItemType } from "../../item";

export default class Flint extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Flint, 100, 'Flint',
        'Sharp and pointy, but not very durable.',
        'items/materials/flint.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}