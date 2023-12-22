import { CreatureType } from "./creature";
import { ItemType } from "./item";
import { ResourceType } from "./resource";

export enum Direction{
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Rigt = 'right',
}

export interface SpawnMap{
    target:CreatureType | ResourceType;
    chance:number;
    min:number;
    max:number;
    limit:number;
}

export interface ItemDrop{
    item:ItemType;
    chance:number;
    min:number;
    max:number;
}