import Item, { ItemType } from "../../item";

export default class Meteorite extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Meteorite, 100, 'Meteorite',
        'Otherworldly meteorite, containing unique properties for crafting exotic items.',
        'items/materials/meteorite.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}