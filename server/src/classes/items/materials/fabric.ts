import Item, { ItemType } from "../../item";

export default class Fabric extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Fabric, 100, 'Fabric',
        'Durable and flexible fabric, ideal for making a variety of wearable items.',
        'items/materials/fabric.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}