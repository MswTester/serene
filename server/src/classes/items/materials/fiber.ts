import Item, { ItemType } from "../../item";

export default class Fiber extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Fiber, 100, 'Fiber',
        'So soft and smooth.',
        'items/materials/fiber.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}