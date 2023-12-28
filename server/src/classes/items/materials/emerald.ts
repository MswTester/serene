import Item, { ItemType } from "../../item";

export default class Emerald extends Item {
    static defaultType = ItemType.Emerald;
    static defaultMaxStack = 100;
    static defaultName = 'Emerald';
    static defaultDescription = 'High-tier jewel.';
    static defaultSrc = 'items/materials/emerald';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Emerald.defaultType,
            Emerald.defaultMaxStack,
            Emerald.defaultName,
            Emerald.defaultDescription,
            Emerald.defaultSrc,
            Emerald.defaultOffsetX,
            Emerald.defaultOffsetY,
            Emerald.defaultRotation,
            Emerald.defaultWidth,
            Emerald.defaultHeight,
            quantity, uuid);
    }
}