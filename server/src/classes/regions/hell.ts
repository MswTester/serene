import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Hell extends Region{
    static defaultType:RegionType = RegionType.Hell;
    static defaultSrc:string = 'regions/hell';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Hell.defaultType,
            Hell.defaultSrc,
            Hell.defaultShades,
            Hell.defaultSpawns,
            polygon
        );
    }
}