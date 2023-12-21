import Region, { RegionType } from '../region';
import Resource, { ResourceType } from '../resource';
import Tree from '../resources/tree';

export default class Forest extends Region{
    constructor(polygon:[number, number][]){
        super(RegionType.Forest, 'regions/forest.png', [],
        [
            {target: Tree, chance: 0.5, min: 1, max: 3},
        ], polygon);
    }
}