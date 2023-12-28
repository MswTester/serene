import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Ocean extends Region{
    static defaultType:RegionType = RegionType.Ocean;
    static defaultSrc:string = 'regions/ocean';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Ocean.defaultType,
            Ocean.defaultSrc,
            Ocean.defaultShades,
            Ocean.defaultSpawns,
            polygon
        );
    }
}