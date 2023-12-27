import { ItemType } from "../item";
import Resource, { ResourceType } from "../resource";

export default class Cactus extends Resource {
    static defaultType:ResourceType = ResourceType.Cactus;
    static defaultMaxHealth:number = 100;
    static defaultHardness:number = 0;
    static defaultDrops:ItemDrop[] = [
    ]
    static defaultRequiredTool:ItemType[] = [];
    static defaultSrc:string = 'resources/cactus.png';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 1.5;
    static defaultIsCollidable:boolean = true;
    static defaultWidth:number = 1;
    static defaultHeight:number = 1;

    constructor(x:number, y:number, uuid?:string, health?:number) {
        super(
            Cactus.defaultType,
            Cactus.defaultMaxHealth,
            Cactus.defaultHardness,
            Cactus.defaultDrops,
            Cactus.defaultRequiredTool,
            Cactus.defaultSrc,
            Cactus.defaultOffsetWidth,
            Cactus.defaultOffsetHeight,
            Cactus.defaultIsCollidable,
            x, y, Cactus.defaultWidth, Cactus.defaultHeight, uuid, health
        );
    }
}