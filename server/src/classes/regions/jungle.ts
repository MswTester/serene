import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Jungle extends Region{
    static defaultType:RegionType = RegionType.Jungle;
    static defaultSrc:string = 'regions/jungle';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Jungle.defaultType,
            Jungle.defaultSrc,
            Jungle.defaultShades,
            Jungle.defaultSpawns,
            polygon
        );
    }
}