import { ItemType } from "../item";
import Resource, { ResourceType } from "../resource";
import { ItemDrop } from "../types";

export default class Palm_Tree extends Resource {
    static defaultType:ResourceType = ResourceType.Palm_Tree;
    static defaultMaxHealth:number = 100;
    static defaultHardness:number = 0;
    static defaultDrops:ItemDrop[] = [
        { item: ItemType.Wood, chance: 1, min: 1, max: 3 }
    ]
    static defaultRequiredTool:ItemType[] = [];
    static defaultSrc:string = 'resources/palm_tree.png';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 2;
    static defaultIsCollidable:boolean = true;
    static defaultWidth:number = 1;
    static defaultHeight:number = 1;

    constructor(x:number, y:number, uuid?:string, health?:number) {
        super(
            Palm_Tree.defaultType,
            Palm_Tree.defaultMaxHealth,
            Palm_Tree.defaultHardness,
            Palm_Tree.defaultDrops,
            Palm_Tree.defaultRequiredTool,
            Palm_Tree.defaultSrc,
            Palm_Tree.defaultOffsetWidth,
            Palm_Tree.defaultOffsetHeight,
            Palm_Tree.defaultIsCollidable,
            x, y, Palm_Tree.defaultWidth, Palm_Tree.defaultHeight, uuid, health
        );
    }
}