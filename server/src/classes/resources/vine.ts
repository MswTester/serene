import { ItemType } from "../item";
import Resource, { ResourceType } from "../resource";

export default class Vine extends Resource {
    static defaultType:ResourceType = ResourceType.Vine;
    static defaultMaxHealth:number = 100;
    static defaultHardness:number = 0;
    static defaultDrops:ItemDrop[] = [
        { item: ItemType.Fiber, chance: 1, min: 3, max: 5 }
    ]
    static defaultRequiredTool:ItemType[] = [];
    static defaultSrc:string = 'resources/vine';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 1;
    static defaultIsCollidable:boolean = true;
    static defaultWidth:number = 1;
    static defaultHeight:number = 1;

    constructor(x:number, y:number, uuid?:string, health?:number) {
        super(
            Vine.defaultType,
            Vine.defaultMaxHealth,
            Vine.defaultHardness,
            Vine.defaultDrops,
            Vine.defaultRequiredTool,
            Vine.defaultSrc,
            Vine.defaultOffsetWidth,
            Vine.defaultOffsetHeight,
            Vine.defaultIsCollidable,
            x, y, Vine.defaultWidth, Vine.defaultHeight, uuid, health
        );
    }
}