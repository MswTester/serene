import Item, { ItemType } from "../../item";

export default class Aluminum extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Aluminum, 100, 'Aluminum',
        'Lightweight and rust-resistant aluminum, ideal for crafting durable and lightweight items.',
        'items/materials/aluminum.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}