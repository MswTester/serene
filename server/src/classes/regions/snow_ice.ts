import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Snow_Ice extends Region{
    static defaultType:RegionType = RegionType.Snow_Ice;
    static defaultSrc:string = 'regions/snow_ice';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Snow_Ice.defaultType,
            Snow_Ice.defaultSrc,
            Snow_Ice.defaultShades,
            Snow_Ice.defaultSpawns,
            polygon
        );
    }
}