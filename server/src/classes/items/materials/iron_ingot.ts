import Item, { ItemType } from "../../item";

export default class Iron_Ingot extends Item {
    static defaultType = ItemType.Iron_Ingot;
    static defaultMaxStack = 100;
    static defaultName = 'Iron_Ingot';
    static defaultDescription = 'Useful for crafting tools and weapons.';
    static defaultSrc = 'items/materials/iron_ingot';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Iron_Ingot.defaultType,
            Iron_Ingot.defaultMaxStack,
            Iron_Ingot.defaultName,
            Iron_Ingot.defaultDescription,
            Iron_Ingot.defaultSrc,
            Iron_Ingot.defaultOffsetX,
            Iron_Ingot.defaultOffsetY,
            Iron_Ingot.defaultRotation,
            Iron_Ingot.defaultWidth,
            Iron_Ingot.defaultHeight,
            quantity, uuid);
    }
}