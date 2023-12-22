import Item, { ItemType } from "../../item";

export default class Fabric extends Item {
    constructor(quantity:number = 1) {
        super(ItemType.Fabric, 100, 'Fabric', 'A piece of fabric.', 'items/materials/fabric.png', 0.3, 0, 0, 0.2, 0.2, quantity);
    }
}