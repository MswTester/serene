import { ItemType } from "../item";
import Wood from "../items/materials/wood";
import Resource, { ResourceType } from "../resource";

export default class Oak_Tree extends Resource {
    constructor(x:number, y:number) {
        super(ResourceType.Oak_Tree, 100, 0, [
            { item: Wood, chance: 1, min: 1, max: 3 }
        ], [], 'oak_tree.png', 1.2, 1.5, true, x, y, 1, 1);
    }
}