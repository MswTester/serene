import Item, { ItemType } from "../../item";

export default class Sand extends Item {
    static defaultType = ItemType.Sand;
    static defaultMaxStack = 100;
    static defaultName = 'Sand';
    static defaultDescription = 'Can be glint.';
    static defaultSrc = 'items/materials/sand';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Sand.defaultType,
            Sand.defaultMaxStack,
            Sand.defaultName,
            Sand.defaultDescription,
            Sand.defaultSrc,
            Sand.defaultOffsetX,
            Sand.defaultOffsetY,
            Sand.defaultRotation,
            Sand.defaultWidth,
            Sand.defaultHeight,
            quantity, uuid);
    }
}