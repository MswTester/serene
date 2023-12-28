import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Forest_Lake extends Region{
    static defaultType:RegionType = RegionType.Forest_Lake;
    static defaultSrc:string = 'regions/forest_lake';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Forest_Lake.defaultType,
            Forest_Lake.defaultSrc,
            Forest_Lake.defaultShades,
            Forest_Lake.defaultSpawns,
            polygon
        );
    }
}