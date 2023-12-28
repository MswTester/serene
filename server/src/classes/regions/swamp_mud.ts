import Region, { RegionType } from '../region';
import { ResourceType } from '../resource';

export default class Swamp_Mud extends Region{
    static defaultType:RegionType = RegionType.Swamp_Mud;
    static defaultSrc:string = 'regions/swamp_mud';
    static defaultShades:string[] = [];
    static defaultSpawns:SpawnMap[] = [];


    constructor(polygon:[number, number][]){
        super(
            Swamp_Mud.defaultType,
            Swamp_Mud.defaultSrc,
            Swamp_Mud.defaultShades,
            Swamp_Mud.defaultSpawns,
            polygon
        );
    }
}