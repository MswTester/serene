import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Space extends Region{
    static defaultType:RegionType = RegionType.Space;
    static defaultSrc:string = 'regions/space';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Space.defaultType,
            Space.defaultSrc,
            Space.defaultShades,
            Space.defaultSpawns,
            polygon
        );
    }
}