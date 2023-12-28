import Item, { ItemType } from "../../item";

export default class Flint extends Item {
    static defaultType = ItemType.Flint;
    static defaultMaxStack = 100;
    static defaultName = 'Flint';
    static defaultDescription = 'Sharp and pointy, but not very durable.';
    static defaultSrc = 'items/materials/flint';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Flint.defaultType,
            Flint.defaultMaxStack,
            Flint.defaultName,
            Flint.defaultDescription,
            Flint.defaultSrc,
            Flint.defaultOffsetX,
            Flint.defaultOffsetY,
            Flint.defaultRotation,
            Flint.defaultWidth,
            Flint.defaultHeight,
            quantity, uuid);
    }
}