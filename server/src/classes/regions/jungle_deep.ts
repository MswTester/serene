import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Jungle_Deep extends Region{
    static defaultType:RegionType = RegionType.Jungle_Deep;
    static defaultSrc:string = 'regions/jungle_deep';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Jungle_Deep.defaultType,
            Jungle_Deep.defaultSrc,
            Jungle_Deep.defaultShades,
            Jungle_Deep.defaultSpawns,
            polygon
        );
    }
}