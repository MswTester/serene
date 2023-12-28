import Item, { ItemType } from "../../item";

export default class Meteorite extends Item {
    static defaultType = ItemType.Meteorite;
    static defaultMaxStack = 100;
    static defaultName = 'Meteorite';
    static defaultDescription = 'From the mysterious beyond.';
    static defaultSrc = 'items/materials/meteorite';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Meteorite.defaultType,
            Meteorite.defaultMaxStack,
            Meteorite.defaultName,
            Meteorite.defaultDescription,
            Meteorite.defaultSrc,
            Meteorite.defaultOffsetX,
            Meteorite.defaultOffsetY,
            Meteorite.defaultRotation,
            Meteorite.defaultWidth,
            Meteorite.defaultHeight,
            quantity, uuid);
    }
}