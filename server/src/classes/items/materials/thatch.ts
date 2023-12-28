import Item, { ItemType } from "../../item";

export default class Thatch extends Item {
    static defaultType = ItemType.Thatch;
    static defaultMaxStack = 100;
    static defaultName = 'Thatch';
    static defaultDescription = 'A bundle of dried grass.';
    static defaultSrc = 'items/materials/thatch';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Thatch.defaultType,
            Thatch.defaultMaxStack,
            Thatch.defaultName,
            Thatch.defaultDescription,
            Thatch.defaultSrc,
            Thatch.defaultOffsetX,
            Thatch.defaultOffsetY,
            Thatch.defaultRotation,
            Thatch.defaultWidth,
            Thatch.defaultHeight,
            quantity, uuid);
    }
}