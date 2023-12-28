import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Swamp extends Region{
    static defaultType:RegionType = RegionType.Swamp;
    static defaultSrc:string = 'regions/swamp';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Swamp.defaultType,
            Swamp.defaultSrc,
            Swamp.defaultShades,
            Swamp.defaultSpawns,
            polygon
        );
    }
}