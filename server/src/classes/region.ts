import Creature, { CreatureType } from './creature';
import Resource, { ResourceType } from './resource';
import { getPolygonArea, getRandomPositionInPolygon, isInsidePolygon, EventEmitter } from './utils';

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

    getSize():number {
        return getPolygonArea(this.polygon);
    }

    getRandomPoint():[number, number] {
        return getRandomPositionInPolygon(this.polygon);
    }

    countSourceInRegion(sources:(Creature|Resource)[], sourceType:CreatureType|ResourceType):number {
        let count = 0;
        sources.forEach((source) => {
            if(source.type == sourceType){
                if(isInsidePolygon([source.x, source.y], this.polygon)){
                    count++;
                }
            }
        });
        return count;
    }

    getSaveFormat(){
        return {
            type: this.type,
            polygon: this.polygon,
        }
    }
}

export interface RegionSaveFormat{
    type:RegionType;
    polygon:[number, number][];
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