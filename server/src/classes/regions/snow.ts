import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Snow extends Region{
    static defaultType:RegionType = RegionType.Snow;
    static defaultSrc:string = 'regions/snow';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Snow.defaultType,
            Snow.defaultSrc,
            Snow.defaultShades,
            Snow.defaultSpawns,
            polygon
        );
    }
}