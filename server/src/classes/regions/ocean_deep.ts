import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Ocean_Deep extends Region{
    constructor(polygon:[number, number][]){
        super(RegionType.Ocean_Deep, 'regions/ocean_deep.png', [],
        [
            // {target: ResourceType.Tree, chance: 0.5, min: 1, max: 3, limit: 5},
        ], polygon);
    }
}