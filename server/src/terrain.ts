export enum TerrainType {
    GRASS,
    DIRT,
    STONE,
    WATER,
    SAND,
    SNOW,
    ICE,
    LAVA,
    CLOUD,
    AIR
}

export class Terrain {
    readonly type:TerrainType;
    readonly src:string;
    readonly x:number = 0;
    readonly y:number = 0;
    readonly width:number = 1;
    readonly height:number = 1;
    constructor(type:TerrainType, src:string, x:number, y:number, width:number, height:number){
        this.type = type;
        this.src = src;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }
}