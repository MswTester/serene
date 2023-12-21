import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Desert_Sandstone extends Region{
    constructor(polygon:[number, number][]){
        super(RegionType.Desert_Sandstone, 'regions/desert_sandstone.png', [],
        [
            // {target: ResourceType.Tree, chance: 0.5, min: 1, max: 3, limit: 5},
        ], polygon);
    }
}