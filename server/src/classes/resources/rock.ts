import { ItemType } from "../item";
import Resource, { ResourceType } from "../resource";

export default class Rock extends Resource {
    static defaultType:ResourceType = ResourceType.Rock;
    static defaultMaxHealth:number = 100;
    static defaultHardness:number = 0;
    static defaultDrops:ItemDrop[] = [
        { item: ItemType.Stone, chance: 1, min: 1, max: 3 }
    ]
    static defaultRequiredTool:ItemType[] = [];
    static defaultSrc:string = 'resources/rock.png';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 1;
    static defaultIsCollidable:boolean = true;
    static defaultWidth:number = 1;
    static defaultHeight:number = 1;

    constructor(x:number, y:number, uuid?:string, health?:number) {
        super(
            Rock.defaultType,
            Rock.defaultMaxHealth,
            Rock.defaultHardness,
            Rock.defaultDrops,
            Rock.defaultRequiredTool,
            Rock.defaultSrc,
            Rock.defaultOffsetWidth,
            Rock.defaultOffsetHeight,
            Rock.defaultIsCollidable,
            x, y, Rock.defaultWidth, Rock.defaultHeight, uuid, health
        );
    }
}