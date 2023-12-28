import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Swamp_Water extends Region{
    static defaultType:RegionType = RegionType.Swamp_Water;
    static defaultSrc:string = 'regions/swamp_water';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Swamp_Water.defaultType,
            Swamp_Water.defaultSrc,
            Swamp_Water.defaultShades,
            Swamp_Water.defaultSpawns,
            polygon
        );
    }
}