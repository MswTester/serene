import Item, { ItemType } from "../../item";

export default class Leather extends Item {
    static defaultType = ItemType.Leather;
    static defaultMaxStack = 100;
    static defaultName = 'Leather';
    static defaultDescription = 'Tough and durable material.';
    static defaultSrc = 'items/materials/leather';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Leather.defaultType,
            Leather.defaultMaxStack,
            Leather.defaultName,
            Leather.defaultDescription,
            Leather.defaultSrc,
            Leather.defaultOffsetX,
            Leather.defaultOffsetY,
            Leather.defaultRotation,
            Leather.defaultWidth,
            Leather.defaultHeight,
            quantity, uuid);
    }
}