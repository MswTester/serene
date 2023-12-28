import Item, { ItemType } from "../../item";

export default class Mithril extends Item {
    static defaultType = ItemType.Mithril;
    static defaultMaxStack = 100;
    static defaultName = 'Mithril';
    static defaultDescription = 'There\'s mythical power in it.';
    static defaultSrc = 'items/materials/mithril';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Mithril.defaultType,
            Mithril.defaultMaxStack,
            Mithril.defaultName,
            Mithril.defaultDescription,
            Mithril.defaultSrc,
            Mithril.defaultOffsetX,
            Mithril.defaultOffsetY,
            Mithril.defaultRotation,
            Mithril.defaultWidth,
            Mithril.defaultHeight,
            quantity, uuid);
    }
}