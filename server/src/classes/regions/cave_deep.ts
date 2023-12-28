import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Cave_Deep extends Region{
    static defaultType:RegionType = RegionType.Cave_Deep;
    static defaultSrc:string = 'regions/cave_deep';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Cave_Deep.defaultType,
            Cave_Deep.defaultSrc,
            Cave_Deep.defaultShades,
            Cave_Deep.defaultSpawns,
            polygon
        );
    }
}