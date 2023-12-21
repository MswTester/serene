import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Snow_Ice extends Region{
    constructor(polygon:[number, number][]){
        super(RegionType.Snow_Ice, 'regions/snow_ice.png', [],
        [
            // {target: ResourceType.Tree, chance: 0.5, min: 1, max: 3, limit: 5},
        ], polygon);
    }
}