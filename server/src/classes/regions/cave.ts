import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Cave extends Region{
    static defaultType:RegionType = RegionType.Cave;
    static defaultSrc:string = 'regions/cave';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Cave.defaultType,
            Cave.defaultSrc,
            Cave.defaultShades,
            Cave.defaultSpawns,
            polygon
        );
    }
}