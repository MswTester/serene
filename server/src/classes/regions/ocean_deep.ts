import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Ocean_Deep extends Region{
    static defaultType:RegionType = RegionType.Ocean_Deep;
    static defaultSrc:string = 'regions/ocean_deep';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Ocean_Deep.defaultType,
            Ocean_Deep.defaultSrc,
            Ocean_Deep.defaultShades,
            Ocean_Deep.defaultSpawns,
            polygon
        );
    }
}