import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Forest extends Region{
    static defaultType:RegionType = RegionType.Forest;
    static defaultSrc:string = 'regions/forest';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [
        {target: ResourceType.Oak_Tree, chance: 0.8, min: 0.1, max: 0.2, limit: 0.4},
    ];


    constructor(polygon:[number, number][]){
        super(
            Forest.defaultType,
            Forest.defaultSrc,
            Forest.defaultShades,
            Forest.defaultSpawns,
            polygon
        );
    }
}