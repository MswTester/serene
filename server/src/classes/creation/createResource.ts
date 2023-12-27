import Resource, { ResourceType } from "../resource";
import Cactus from "../resources/cactus";
import Cotton_Tree from "../resources/cotton_tree";
import Grass from "../resources/grass";
import Oak_Tree from "../resources/oak_tree";
import Palm_Tree from "../resources/palm_tree";
import Rock from "../resources/rock";
import Sandstone from "../resources/sandstone";
import Vine from "../resources/vine";

export const createResource = (type:ResourceType, x:number, y:number,
    uuid?:string, health?:number):Resource => {
    switch(type){
        case ResourceType.Oak_Tree:
            return new Oak_Tree(x, y, uuid, health);
        case ResourceType.Cotton_Tree:
            return new Cotton_Tree(x, y, uuid, health);
        case ResourceType.Palm_Tree:
            return new Palm_Tree(x, y, uuid, health);
        case ResourceType.Rock:
            return new Rock(x, y, uuid, health);
        case ResourceType.Grass:
            return new Grass(x, y, uuid, health);
        case ResourceType.Vine:
            return new Vine(x, y, uuid, health);
        case ResourceType.Sandstone:
            return new Sandstone(x, y, uuid, health);
        case ResourceType.Cactus:
            return new Cactus(x, y, uuid, health);
        default:
            throw new Error('Invalid resource type.');
    }
}