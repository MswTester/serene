import Item, { ItemType } from "../../item";

export default class Copper extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Copper, 100, 'Copper',
        'Conductive copper, widely used in electrical components and decorative items.',
        'items/materials/copper.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}