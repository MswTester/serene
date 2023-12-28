import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Forest_Deep extends Region{
    static defaultType:RegionType = RegionType.Forest_Deep;
    static defaultSrc:string = 'regions/forest_deep';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Forest_Deep.defaultType,
            Forest_Deep.defaultSrc,
            Forest_Deep.defaultShades,
            Forest_Deep.defaultSpawns,
            polygon
        );
    }
}