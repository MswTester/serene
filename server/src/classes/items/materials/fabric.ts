import Item, { ItemType } from "../../item";

export default class Fabric extends Item {
    static defaultType = ItemType.Fabric;
    static defaultMaxStack = 100;
    static defaultName = 'Fabric';
    static defaultDescription = 'Usually used for clothing.';
    static defaultSrc = 'items/materials/fabric';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Fabric.defaultType,
            Fabric.defaultMaxStack,
            Fabric.defaultName,
            Fabric.defaultDescription,
            Fabric.defaultSrc,
            Fabric.defaultOffsetX,
            Fabric.defaultOffsetY,
            Fabric.defaultRotation,
            Fabric.defaultWidth,
            Fabric.defaultHeight,
            quantity, uuid);
    }
}