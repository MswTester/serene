import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Cave_Dark extends Region{
    constructor(polygon:[number, number][]){
        super(RegionType.Cave_Dark, 'regions/cave_dark.png', [],
        [
            // {target: ResourceType.Tree, chance: 0.5, min: 1, max: 3, limit: 5},
        ], polygon);
    }
}