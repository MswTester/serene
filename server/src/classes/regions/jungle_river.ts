import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Jungle_River extends Region{
    static defaultType:RegionType = RegionType.Jungle_River;
    static defaultSrc:string = 'regions/jungle_river';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Jungle_River.defaultType,
            Jungle_River.defaultSrc,
            Jungle_River.defaultShades,
            Jungle_River.defaultSpawns,
            polygon
        );
    }
}