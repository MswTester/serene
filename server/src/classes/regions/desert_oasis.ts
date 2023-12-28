import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Desert_Oasis extends Region{
    static defaultType:RegionType = RegionType.Desert_Oasis;
    static defaultSrc:string = 'regions/desert_oasis';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Desert_Oasis.defaultType,
            Desert_Oasis.defaultSrc,
            Desert_Oasis.defaultShades,
            Desert_Oasis.defaultSpawns,
            polygon
        );
    }
}