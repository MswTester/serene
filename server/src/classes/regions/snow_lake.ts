import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Snow_Lake extends Region{
    static defaultType:RegionType = RegionType.Snow_Lake;
    static defaultSrc:string = 'regions/snow_lake';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Snow_Lake.defaultType,
            Snow_Lake.defaultSrc,
            Snow_Lake.defaultShades,
            Snow_Lake.defaultSpawns,
            polygon
        );
    }
}