import Item, { ItemType } from "../../item";

export default class Cotton extends Item {
    static defaultType = ItemType.Cotton;
    static defaultMaxStack = 100;
    static defaultName = 'Cotton';
    static defaultDescription = 'Very soft and fluffy.';
    static defaultSrc = 'items/materials/cotton';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Cotton.defaultType,
            Cotton.defaultMaxStack,
            Cotton.defaultName,
            Cotton.defaultDescription,
            Cotton.defaultSrc,
            Cotton.defaultOffsetX,
            Cotton.defaultOffsetY,
            Cotton.defaultRotation,
            Cotton.defaultWidth,
            Cotton.defaultHeight,
            quantity, uuid);
    }
}