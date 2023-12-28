import Item, { ItemType } from "../../item";

export default class Stone extends Item {
    static defaultType = ItemType.Stone;
    static defaultMaxStack = 100;
    static defaultName = 'Stone';
    static defaultDescription = 'Heavy and hard.';
    static defaultSrc = 'items/materials/stone';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Stone.defaultType,
            Stone.defaultMaxStack,
            Stone.defaultName,
            Stone.defaultDescription,
            Stone.defaultSrc,
            Stone.defaultOffsetX,
            Stone.defaultOffsetY,
            Stone.defaultRotation,
            Stone.defaultWidth,
            Stone.defaultHeight,
            quantity, uuid);
    }
}