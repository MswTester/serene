import Item, { ItemType } from "../../item";

export default class Copper extends Item {
    static defaultType = ItemType.Copper;
    static defaultMaxStack = 100;
    static defaultName = 'Copper';
    static defaultDescription = 'More conductive and malleable.';
    static defaultSrc = 'items/materials/copper';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Copper.defaultType,
            Copper.defaultMaxStack,
            Copper.defaultName,
            Copper.defaultDescription,
            Copper.defaultSrc,
            Copper.defaultOffsetX,
            Copper.defaultOffsetY,
            Copper.defaultRotation,
            Copper.defaultWidth,
            Copper.defaultHeight,
            quantity, uuid);
    }
}