import Region, { RegionType } from './region';
import Forest from './regions/forest';
import Forest_Deep from './regions/forest_deep';
import Forest_Lake from './regions/forest_lake';
import Ocean from './regions/ocean';
import Ocean_Deep from './regions/ocean_deep';
import Space from './regions/space';
import Desert from './regions/desert';
import Desert_Sandstone from './regions/desert_sandstone';
import Desert_Oasis from './regions/desert_oasis';
import Snow from './regions/snow';
import Snow_Ice from './regions/snow_ice';
import Snow_Lake from './regions/snow_lake';
import Jungle from './regions/jungle';
import Jungle_Deep from './regions/jungle_deep';
import Jungle_River from './regions/jungle_river';
import Swamp from './regions/swamp';
import Swamp_Mud from './regions/swamp_mud';
import Swamp_Water from './regions/swamp_water';
import Cave from './regions/cave';
import Cave_Deep from './regions/cave_deep';
import Cave_Dark from './regions/cave_dark';
import Hell from './regions/hell';
import Hell_Lava from './regions/hell_lava';
import Creature, { CreatureType } from './creature';
import Resource, { ResourceType } from './resource';
import Oak_Tree from './resources/oak_tree';

/** RegionType에 따라 Region을 생성합니다. */
export const createRegion = (type:RegionType, polygon:[number, number][]):Region => {
    switch(type){
        case RegionType.Forest:
            return new Forest(polygon);
        case RegionType.Forest_Deep:
            return new Forest_Deep(polygon);
        case RegionType.Forest_Lake:
            return new Forest_Lake(polygon);
        case RegionType.Ocean:
            return new Ocean(polygon);
        case RegionType.Ocean_Deep:
            return new Ocean_Deep(polygon);
        case RegionType.Desert:
            return new Desert(polygon);
        case RegionType.Desert_Sandstone:
            return new Desert_Sandstone(polygon);
        case RegionType.Desert_Oasis:
            return new Desert_Oasis(polygon);
        case RegionType.Snow:
            return new Snow(polygon);
        case RegionType.Snow_Ice:
            return new Snow_Ice(polygon);
        case RegionType.Snow_Lake:
            return new Snow_Lake(polygon);
        case RegionType.Jungle:
            return new Jungle(polygon);
        case RegionType.Jungle_Deep:
            return new Jungle_Deep(polygon);
        case RegionType.Jungle_River:
            return new Jungle_River(polygon);
        case RegionType.Swamp:
            return new Swamp(polygon);
        case RegionType.Swamp_Mud:
            return new Swamp_Mud(polygon);
        case RegionType.Swamp_Water:
            return new Swamp_Water(polygon);
        case RegionType.Cave:
            return new Cave(polygon);
        case RegionType.Cave_Deep:
            return new Cave_Deep(polygon);
        case RegionType.Cave_Dark:
            return new Cave_Dark(polygon)
        case RegionType.Hell:
            return new Hell(polygon);
        case RegionType.Hell_Lava:
            return new Hell_Lava(polygon);
        case RegionType.Space:
            return new Space(polygon);
    }
}

/** CreatureType에 따라 Creature 생성 */
export const createCreature = (type:CreatureType, x:number, y:number):Creature => {
    switch(type){
        // case CreatureType:
        default:
            return null;
    }
}

/** ResourceType에 따라 Resource 생성 */
export const createResource = (type:ResourceType, x:number, y:number):Resource => {
    switch(type){
        case ResourceType.Oak_Tree:
            return new Oak_Tree(x, y);
    }
}