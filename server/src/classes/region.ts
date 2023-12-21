import { EventEmitter } from 'events';
import Creature, { CreatureType } from './creature';
import Resource, { ResourceType } from './resource';

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
    Forest_Water = 'forest_water',
    Ocean = 'ocean',
    Ocean_Deep = 'ocean_deep',
    Cave = 'cave',
    Cave_Deep = 'cave_deep',
    Cave_Water = 'cave_water',
    Desert = 'desert',
    Desert_Water = 'desert_water',
    Snow = 'snow',
    Snow_Ice = 'snow_ice',
    Snow_Cave = 'snow_cave',
    Swamp = 'swamp',
    Swamp_Water = 'swamp_water',
    Hell = 'hell',
    Hell_Lava = 'hell_lava',
    Space = 'space',
}

export interface SpawnMap{
    target:new (...args: any[]) => Creature | Resource;
    chance:number;
    min:number;
    max:number;
}