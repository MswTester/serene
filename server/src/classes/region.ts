import { EventEmitter } from 'events';
import Creature, { CreatureType } from './creature';
import Resource, { ResourceType } from './resource';
import Forest from './regions/forest';
import { SpawnMap } from './types';

export default class Region {
    readonly type:RegionType;

    readonly src:string;

    readonly shades:string[];
    readonly spawns:SpawnMap[];

    events:EventEmitter;

    polygon:[number, number][];
    
    constructor(type:RegionType, src:string, shades:string[], spawns:SpawnMap[],
        polygon:[number, number][]){
        this.type = type;
        this.src = src;
        this.shades = shades;
        this.spawns = spawns;
        
        this.events = new EventEmitter();
        this.polygon = polygon;
    }

    on(event:string, listener:(...args: any[]) => void){
        this.events.on(event, listener);
    }

    emit(event:string, ...args:any[]){
        this.events.emit(event, ...args);
    }
}

export enum RegionType{
    Forest = 'forest',
    Forest_Deep = 'forest_deep',
    Forest_Lake = 'forest_lake',
    Ocean = 'ocean',
    Ocean_Deep = 'ocean_deep',
    Cave = 'cave',
    Cave_Deep = 'cave_deep',
    Cave_Dark = 'cave_dark',
    Desert = 'desert',
    Desert_Sandstone = 'desert_sandstone',
    Desert_Oasis = 'desert_oasis',
    Snow = 'snow',
    Snow_Ice = 'snow_ice',
    Snow_Lake = 'snow_lake',
    Swamp = 'swamp',
    Swamp_Mud = 'swamp_mud',
    Swamp_Water = 'swamp_water',
    Jungle = 'jungle',
    Jungle_Deep = 'jungle_deep',
    Jungle_River = 'jungle_river',
    Hell = 'hell',
    Hell_Lava = 'hell_lava',
    Space = 'space',
}