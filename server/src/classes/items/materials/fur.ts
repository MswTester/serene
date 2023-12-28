import Item, { ItemType } from "../../item";

export default class Fur extends Item {
    static defaultType = ItemType.Fur;
    static defaultMaxStack = 100;
    static defaultName = 'Fur';
    static defaultDescription = 'Warm and fuzzy.';
    static defaultSrc = 'items/materials/fur';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Fur.defaultType,
            Fur.defaultMaxStack,
            Fur.defaultName,
            Fur.defaultDescription,
            Fur.defaultSrc,
            Fur.defaultOffsetX,
            Fur.defaultOffsetY,
            Fur.defaultRotation,
            Fur.defaultWidth,
            Fur.defaultHeight,
            quantity, uuid);
    }
}