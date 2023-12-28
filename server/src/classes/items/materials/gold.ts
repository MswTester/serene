import Item, { ItemType } from "../../item";

export default class Gold extends Item {
    static defaultType = ItemType.Gold;
    static defaultMaxStack = 100;
    static defaultName = 'Gold';
    static defaultDescription = 'Precious and most conductive material.';
    static defaultSrc = 'items/materials/gold';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Gold.defaultType,
            Gold.defaultMaxStack,
            Gold.defaultName,
            Gold.defaultDescription,
            Gold.defaultSrc,
            Gold.defaultOffsetX,
            Gold.defaultOffsetY,
            Gold.defaultRotation,
            Gold.defaultWidth,
            Gold.defaultHeight,
            quantity, uuid);
    }
}