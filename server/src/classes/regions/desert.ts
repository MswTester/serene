import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Desert extends Region{
    static defaultType:RegionType = RegionType.Desert;
    static defaultSrc:string = 'regions/desert';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Desert.defaultType,
            Desert.defaultSrc,
            Desert.defaultShades,
            Desert.defaultSpawns,
            polygon
        );
    }
}