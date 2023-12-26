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
import { Direction } from './types';
import Item, { ItemType } from './item';
import Wood from './items/materials/wood';
import Gold from './items/materials/gold';
import Iron from './items/materials/iron';
import Stone from './items/materials/stone';
import Cotton from './items/materials/cotton';
import Thread from './items/materials/thread';
import Fabric from './items/materials/fabric';
import Leather from './items/materials/leather';
import Fur from './items/materials/fur';
import Fiber from './items/materials/fiber';
import Thatch from './items/materials/thatch';
import Flint from './items/materials/flint';
import Iron_Ingot from './items/materials/iron_metal';
import Aluminum from './items/materials/aluminum';
import Copper from './items/materials/copper';
import Platinum from './items/materials/platinum';
import Mithril from './items/materials/mithril';
import Adamantium from './items/materials/adamantium';
import Meteorite from './items/materials/meteorite';
import Titanium from './items/materials/titanium';

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
export const createCreature = (type:CreatureType, x:number, y:number,
    uuid?:string, dx?:number, dy?:number, direction?:Direction,
    level?:number, exp?:number, state?:string, health?:number, food?:number,
    isTamed?:boolean, inventory?:any[], ownerId?:string, ownerGuildId?:string):Creature => {
    switch(type){
        // case CreatureType:
        default:
            return null;
    }
}

/** ResourceType에 따라 Resource 생성 */
export const createResource = (type:ResourceType, x:number, y:number,
    uuid?:string, health?:number):Resource => {
    switch(type){
        case ResourceType.Oak_Tree:
            return new Oak_Tree(x, y, uuid, health);
    }
}

/** ItemType에 따라 Item 생성 */
export const createItem = (type:ItemType, amount:number):Item => {
    switch(type){
        case ItemType.Cotton:
            return new Cotton(amount);
        case ItemType.Thread:
            return new Thread(amount);
        case ItemType.Fabric:
            return new Fabric(amount);
        case ItemType.Leather:
            return new Leather(amount);
        case ItemType.Fur:
            return new Fur(amount);
        case ItemType.Fiber:
            return new Fiber(amount);
        case ItemType.Wood:
            return new Wood(amount);
        case ItemType.Thatch:
            return new Thatch(amount);
        case ItemType.Stone:
            return new Stone(amount);
        case ItemType.Flint:
            return new Flint(amount)
        case ItemType.Iron:
            return new Iron(amount);
        case ItemType.Iron_Ingot:
            return new Iron_Ingot(amount);
        case ItemType.Aluminum:
            return new Aluminum(amount);
        case ItemType.Copper:
            return new Copper(amount);
        case ItemType.Gold:
            return new Gold(amount);
        case ItemType.Platinum:
            return new Platinum(amount);
        case ItemType.Mithril:
            return new Mithril(amount);
        case ItemType.Adamantium:
            return new Adamantium(amount);
        case ItemType.Titanium:
            return new Titanium(amount);
        case ItemType.Topaz:
        //     return new Topaz(amount);
        // case ItemType.Ruby:
        //     return new Ruby(amount);
        // case ItemType.Emerald:
        //     return new Emerald(amount);
        // case ItemType.Diamond:
        //     return new Diamond(amount);
        case ItemType.Meteorite:
            return new Meteorite(amount);
    }
}