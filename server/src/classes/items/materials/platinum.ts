import Item, { ItemType } from "../../item";

export default class Platinum extends Item {
    static defaultType = ItemType.Platinum;
    static defaultMaxStack = 100;
    static defaultName = 'Platinum';
    static defaultDescription = 'Rare and valuable.';
    static defaultSrc = 'items/materials/platinum';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Platinum.defaultType,
            Platinum.defaultMaxStack,
            Platinum.defaultName,
            Platinum.defaultDescription,
            Platinum.defaultSrc,
            Platinum.defaultOffsetX,
            Platinum.defaultOffsetY,
            Platinum.defaultRotation,
            Platinum.defaultWidth,
            Platinum.defaultHeight,
            quantity, uuid);
    }
}