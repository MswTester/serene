import Item, { ItemType } from "../../item";

export default class Diamond extends Item {
    static defaultType = ItemType.Diamond;
    static defaultMaxStack = 100;
    static defaultName = 'Diamond';
    static defaultDescription = 'Top-tier jewel.';
    static defaultSrc = 'items/materials/diamond';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Diamond.defaultType,
            Diamond.defaultMaxStack,
            Diamond.defaultName,
            Diamond.defaultDescription,
            Diamond.defaultSrc,
            Diamond.defaultOffsetX,
            Diamond.defaultOffsetY,
            Diamond.defaultRotation,
            Diamond.defaultWidth,
            Diamond.defaultHeight,
            quantity, uuid);
    }
}