import { ItemType } from "../item";
import Resource, { ResourceType } from "../resource";

export default class Oak_Tree extends Resource {
    static defaultType:ResourceType = ResourceType.Oak_Tree;
    static defaultMaxHealth:number = 100;
    static defaultHardness:number = 0;
    static defaultDrops:ItemDrop[] = [
        { item: ItemType.Wood, chance: 1, min: 1, max: 3 }
    ]
    static defaultRequiredTool:ItemType[] = [];
    static defaultSrc:string = 'resources/oak_tree';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 2;
    static defaultIsCollidable:boolean = true;
    static defaultWidth:number = 1;
    static defaultHeight:number = 1;

    constructor(x:number, y:number, uuid?:string, health?:number) {
        super(
            Oak_Tree.defaultType,
            Oak_Tree.defaultMaxHealth,
            Oak_Tree.defaultHardness,
            Oak_Tree.defaultDrops,
            Oak_Tree.defaultRequiredTool,
            Oak_Tree.defaultSrc,
            Oak_Tree.defaultOffsetWidth,
            Oak_Tree.defaultOffsetHeight,
            Oak_Tree.defaultIsCollidable,
            x, y, Oak_Tree.defaultWidth, Oak_Tree.defaultHeight, uuid, health
        );
    }
}