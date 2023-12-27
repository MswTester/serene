import { ItemType } from "../item";
import Resource, { ResourceType } from "../resource";

export default class Cotton_Tree extends Resource {
    static defaultType:ResourceType = ResourceType.Cotton_Tree;
    static defaultMaxHealth:number = 100;
    static defaultHardness:number = 0;
    static defaultDrops:ItemDrop[] = [
        { item: ItemType.Wood, chance: 1, min: 1, max: 3 },
        { item: ItemType.Cotton, chance: 1, min: 1, max: 2 }
    ]
    static defaultRequiredTool:ItemType[] = [];
    static defaultSrc:string = 'resources/cotton_tree.png';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 2;
    static defaultIsCollidable:boolean = true;
    static defaultWidth:number = 1;
    static defaultHeight:number = 1;

    constructor(x:number, y:number, uuid?:string, health?:number) {
        super(
            Cotton_Tree.defaultType,
            Cotton_Tree.defaultMaxHealth,
            Cotton_Tree.defaultHardness,
            Cotton_Tree.defaultDrops,
            Cotton_Tree.defaultRequiredTool,
            Cotton_Tree.defaultSrc,
            Cotton_Tree.defaultOffsetWidth,
            Cotton_Tree.defaultOffsetHeight,
            Cotton_Tree.defaultIsCollidable,
            x, y, Cotton_Tree.defaultWidth, Cotton_Tree.defaultHeight, uuid, health
        );
    }
}