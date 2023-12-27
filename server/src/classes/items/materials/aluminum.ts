import Item, { ItemType } from "../../item";

export default class Aluminum extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Aluminum, 100, 'Aluminum',
        'Conductive and malleable.',
        'items/materials/aluminum.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}