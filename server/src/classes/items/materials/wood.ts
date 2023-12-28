import Item, { ItemType } from "../../item";

export default class Wood extends Item {
    static defaultType = ItemType.Wood;
    static defaultMaxStack = 100;
    static defaultName = 'Wood';
    static defaultDescription = 'The beginning of all things.';
    static defaultSrc = 'items/materials/wood';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Wood.defaultType,
            Wood.defaultMaxStack,
            Wood.defaultName,
            Wood.defaultDescription,
            Wood.defaultSrc,
            Wood.defaultOffsetX,
            Wood.defaultOffsetY,
            Wood.defaultRotation,
            Wood.defaultWidth,
            Wood.defaultHeight,
            quantity, uuid);
    }
}