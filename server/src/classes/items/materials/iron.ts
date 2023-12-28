import Item, { ItemType } from "../../item";

export default class Iron extends Item {
    static defaultType = ItemType.Iron;
    static defaultMaxStack = 100;
    static defaultName = 'Iron';
    static defaultDescription = 'Strong material for crafting.';
    static defaultSrc = 'items/materials/iron';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Iron.defaultType,
            Iron.defaultMaxStack,
            Iron.defaultName,
            Iron.defaultDescription,
            Iron.defaultSrc,
            Iron.defaultOffsetX,
            Iron.defaultOffsetY,
            Iron.defaultRotation,
            Iron.defaultWidth,
            Iron.defaultHeight,
            quantity, uuid);
    }
}