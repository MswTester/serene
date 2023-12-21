import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Swamp_Mud extends Region{
    constructor(polygon:[number, number][]){
        super(RegionType.Swamp_Mud, 'regions/swamp_mud.png', [],
        [
            // {target: ResourceType.Tree, chance: 0.5, min: 1, max: 3, limit: 5},
        ], polygon);
    }
}