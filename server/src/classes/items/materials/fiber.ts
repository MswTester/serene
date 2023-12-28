import Item, { ItemType } from "../../item";

export default class Fiber extends Item {
    static defaultType = ItemType.Fiber;
    static defaultMaxStack = 100;
    static defaultName = 'Fiber';
    static defaultDescription = 'So soft and smooth.';
    static defaultSrc = 'items/materials/fiber';
    static defaultOffsetX = 0;
    static defaultOffsetY = 0;
    static defaultRotation = 0;
    static defaultWidth = 0.1;
    static defaultHeight = 0.1;
    constructor(quantity:number = 1, uuid?:string) {
        super(
            Fiber.defaultType,
            Fiber.defaultMaxStack,
            Fiber.defaultName,
            Fiber.defaultDescription,
            Fiber.defaultSrc,
            Fiber.defaultOffsetX,
            Fiber.defaultOffsetY,
            Fiber.defaultRotation,
            Fiber.defaultWidth,
            Fiber.defaultHeight,
            quantity, uuid);
    }
}