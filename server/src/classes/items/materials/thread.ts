import Item, { ItemType } from "../../item";

export default class Thread extends Item {
    static defaultType = ItemType.Thread;
    static defaultMaxStack = 100;
    static defaultName = 'Thread';
    static defaultDescription = 'It can be used in many ways.';
    static defaultSrc = 'items/materials/thread';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Thread.defaultType,
            Thread.defaultMaxStack,
            Thread.defaultName,
            Thread.defaultDescription,
            Thread.defaultSrc,
            Thread.defaultOffsetX,
            Thread.defaultOffsetY,
            Thread.defaultRotation,
            Thread.defaultWidth,
            Thread.defaultHeight,
            quantity, uuid);
    }
}