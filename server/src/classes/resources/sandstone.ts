import { ItemType } from "../item";
import Resource, { ResourceType } from "../resource";
import { ItemDrop } from "../types";

export default class Sandstone extends Resource {
    static defaultType:ResourceType = ResourceType.Sandstone;
    static defaultMaxHealth:number = 100;
    static defaultHardness:number = 0;
    static defaultDrops:ItemDrop[] = [
        { item: ItemType.Stone, chance: 1, min: 1, max: 2 },
        { item: ItemType.Sand, chance: 1, min: 2, max: 3 }
    ]
    static defaultRequiredTool:ItemType[] = [];
    static defaultSrc:string = 'resources/sandstone.png';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 1;
    static defaultIsCollidable:boolean = true;
    static defaultWidth:number = 1;
    static defaultHeight:number = 1;

    constructor(x:number, y:number, uuid?:string, health?:number) {
        super(
            Sandstone.defaultType,
            Sandstone.defaultMaxHealth,
            Sandstone.defaultHardness,
            Sandstone.defaultDrops,
            Sandstone.defaultRequiredTool,
            Sandstone.defaultSrc,
            Sandstone.defaultOffsetWidth,
            Sandstone.defaultOffsetHeight,
            Sandstone.defaultIsCollidable,
            x, y, Sandstone.defaultWidth, Sandstone.defaultHeight, uuid, health
        );
    }
}