enum Direction{
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Rigt = 'right',
}

interface SpawnMap{
    target:CreatureType | ResourceType;
    chance:number;
    min:number;
    max:number;
    limit:number;
}

interface ItemDrop{
    item:ItemType;
    chance:number;
    min:number;
    max:number;
}

interface Transform{
    x: number;
    y: number;
    width: number;
    height: number;
}

declare type Point = [number, number];
declare type Polygon = Point[];

enum ShaderType{
}