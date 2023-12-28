import Structure, { StructureType } from "../../structure";

export default class Wooden_Floor extends Structure{
    static defaultType = StructureType.Wooden_Floor;
    static defaultName = 'Wooden Floor';
    static defaultMaxHealth = 100;
    static defaultHardness = 1;
    static defaultDefense = 0;
    static defaultSrc = 'structures/wooden_floor';
    static defaultOffsetWidth = 1;
    static defaultOffsetHeight = 1;
    static defaultIsCollidable = false;
    static defaultWidth = 1;
    static defaultHeight = 1;

    constructor(x:number, y:number, ownerId?:string, ownerGuildId?:string, uuid?:string, health?:number){
        super(
            Wooden_Floor.defaultType,
            Wooden_Floor.defaultName,
            Wooden_Floor.defaultMaxHealth,
            Wooden_Floor.defaultHardness,
            Wooden_Floor.defaultDefense,
            Wooden_Floor.defaultSrc,
            Wooden_Floor.defaultOffsetWidth,
            Wooden_Floor.defaultOffsetHeight,
            Wooden_Floor.defaultIsCollidable,
            x, y, Wooden_Floor.defaultWidth, Wooden_Floor.defaultHeight, ownerId, ownerGuildId, uuid, health
        );
    }
}