import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Hell_Lava extends Region{
    static defaultType:RegionType = RegionType.Hell_Lava;
    static defaultSrc:string = 'regions/hell_lava';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Hell_Lava.defaultType,
            Hell_Lava.defaultSrc,
            Hell_Lava.defaultShades,
            Hell_Lava.defaultSpawns,
            polygon
        );
    }
}