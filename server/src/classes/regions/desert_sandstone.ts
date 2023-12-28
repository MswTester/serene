import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Desert_Sandstone extends Region{
    static defaultType:RegionType = RegionType.Desert_Sandstone;
    static defaultSrc:string = 'regions/desert_sandstone';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Desert_Sandstone.defaultType,
            Desert_Sandstone.defaultSrc,
            Desert_Sandstone.defaultShades,
            Desert_Sandstone.defaultSpawns,
            polygon
        );
    }
}