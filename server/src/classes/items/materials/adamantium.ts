import Item, { ItemType } from "../../item";

export default class Adamantium extends Item {
    static defaultType = ItemType.Adamantium;
    static defaultMaxStack = 100;
    static defaultName = 'Adamantium';
    static defaultDescription = 'There\'s mystery power in it.';
    static defaultSrc = 'items/materials/adamantium';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Adamantium.defaultType,
            Adamantium.defaultMaxStack,
            Adamantium.defaultName,
            Adamantium.defaultDescription,
            Adamantium.defaultSrc,
            Adamantium.defaultOffsetX,
            Adamantium.defaultOffsetY,
            Adamantium.defaultRotation,
            Adamantium.defaultWidth,
            Adamantium.defaultHeight,
            quantity, uuid);
    }
}