import Item, { ItemType } from "../../item";

export default class Topaz extends Item {
    static defaultType = ItemType.Topaz;
    static defaultMaxStack = 100;
    static defaultName = 'Topaz';
    static defaultDescription = 'Low-tier jewel.';
    static defaultSrc = 'items/materials/topaz';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Topaz.defaultType,
            Topaz.defaultMaxStack,
            Topaz.defaultName,
            Topaz.defaultDescription,
            Topaz.defaultSrc,
            Topaz.defaultOffsetX,
            Topaz.defaultOffsetY,
            Topaz.defaultRotation,
            Topaz.defaultWidth,
            Topaz.defaultHeight,
            quantity, uuid);
    }
}