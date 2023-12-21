import { ItemType } from "../item";
import Wood from "../items/others/wood";
import Resource, { ResourceType } from "../resource";

export default class Tree extends Resource {
    constructor(x:number, y:number) {
        super(ResourceType.Tree, 100, 0, [
            { item: Wood, chance: 1, min: 1, max: 3 }
        ], [], 'tree.png', 1.2, 1.5, true, x, y, 1, 1);
    }
}