import Item, { ItemType } from "../../item";

export default class Ruby extends Item {
    static defaultType = ItemType.Ruby;
    static defaultMaxStack = 100;
    static defaultName = 'Ruby';
    static defaultDescription = 'Mid-tier jewel.';
    static defaultSrc = 'items/materials/ruby';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Ruby.defaultType,
            Ruby.defaultMaxStack,
            Ruby.defaultName,
            Ruby.defaultDescription,
            Ruby.defaultSrc,
            Ruby.defaultOffsetX,
            Ruby.defaultOffsetY,
            Ruby.defaultRotation,
            Ruby.defaultWidth,
            Ruby.defaultHeight,
            quantity, uuid);
    }
}