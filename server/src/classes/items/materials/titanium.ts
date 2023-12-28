import Item, { ItemType } from "../../item";

export default class Titanium extends Item {
    static defaultType = ItemType.Titanium;
    static defaultMaxStack = 100;
    static defaultName = 'Titanium';
    static defaultDescription = 'Strong and corrosion-resistant material.';
    static defaultSrc = 'items/materials/titanium';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Titanium.defaultType,
            Titanium.defaultMaxStack,
            Titanium.defaultName,
            Titanium.defaultDescription,
            Titanium.defaultSrc,
            Titanium.defaultOffsetX,
            Titanium.defaultOffsetY,
            Titanium.defaultRotation,
            Titanium.defaultWidth,
            Titanium.defaultHeight,
            quantity, uuid);
    }
}