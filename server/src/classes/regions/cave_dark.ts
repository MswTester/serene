import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Cave_Dark extends Region{
    static defaultType:RegionType = RegionType.Cave_Dark;
    static defaultSrc:string = 'regions/cave_dark';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Cave_Dark.defaultType,
            Cave_Dark.defaultSrc,
            Cave_Dark.defaultShades,
            Cave_Dark.defaultSpawns,
            polygon
        );
    }
}