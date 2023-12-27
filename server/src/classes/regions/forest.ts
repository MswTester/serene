import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Forest extends Region{
    constructor(polygon:Polygon){
        super(RegionType.Forest, 'regions/forest.png', [],
        [
            {target: ResourceType.Oak_Tree, chance: 0.8, min: 0.1, max: 0.2, limit: 0.4},
        ], polygon);
    }
}