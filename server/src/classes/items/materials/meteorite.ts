import Item, { ItemType } from "../../item";

export default class Meteorite extends Item {
    constructor(quantity:number = 1, uuid?:string) {
        super(ItemType.Meteorite, 100, 'Meteorite',
        'From the mysterious beyond.',
        'items/materials/meteorite.png', 0.3, 0, 0, 0.2, 0.2, quantity, uuid);
    }
}