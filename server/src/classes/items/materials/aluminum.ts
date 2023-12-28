import Item, { ItemType } from "../../item";

export default class Aluminum extends Item {
    static defaultType = ItemType.Aluminum;
    static defaultMaxStack = 100;
    static defaultName = 'Aluminum';
    static defaultDescription = 'Conductive and malleable.';
    static defaultSrc = 'items/materials/aluminum';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Aluminum.defaultType,
            Aluminum.defaultMaxStack,
            Aluminum.defaultName,
            Aluminum.defaultDescription,
            Aluminum.defaultSrc,
            Aluminum.defaultOffsetX,
            Aluminum.defaultOffsetY,
            Aluminum.defaultRotation,
            Aluminum.defaultWidth,
            Aluminum.defaultHeight,
            quantity, uuid);
    }
}