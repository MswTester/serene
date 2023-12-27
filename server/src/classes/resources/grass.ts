import { ItemType } from "../item";
import Resource, { ResourceType } from "../resource";

export default class Grass extends Resource {
    static defaultType:ResourceType = ResourceType.Grass;
    static defaultMaxHealth:number = 100;
    static defaultHardness:number = 0;
    static defaultDrops:ItemDrop[] = [
        { item: ItemType.Fiber, chance: 1, min: 3, max: 5 }
    ]
    static defaultRequiredTool:ItemType[] = [];
    static defaultSrc:string = 'resources/grass.png';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 1;
    static defaultIsCollidable:boolean = true;
    static defaultWidth:number = 1;
    static defaultHeight:number = 1;

    constructor(x:number, y:number, uuid?:string, health?:number) {
        super(
            Grass.defaultType,
            Grass.defaultMaxHealth,
            Grass.defaultHardness,
            Grass.defaultDrops,
            Grass.defaultRequiredTool,
            Grass.defaultSrc,
            Grass.defaultOffsetWidth,
            Grass.defaultOffsetHeight,
            Grass.defaultIsCollidable,
            x, y, Grass.defaultWidth, Grass.defaultHeight, uuid, health
        );
    }
}