import Item, { ItemType } from "../item";

export default class Tool extends Item {
    readonly durability:number;
    readonly useSpeed:number;
    readonly damage:number;

    durabilityMultiplier:number = 1;
    useSpeedMultiplier:number = 1;
    damageMultiplier:number = 1;

    constructor(type:ItemType, maxStack:number, name:string, description:string, src:string, offsetX:number, offsetY:number, rotation:number, width:number, height:number, durability:number, useSpeed:number, damage:number, damageMultiplier:number = 1, useSpeedMultiplier:number = 1, durabilityMultiplier:number = 1){
        super(type, maxStack, name, description, src, offsetX, offsetY, rotation, width, height);
        this.durability = durability;
        this.useSpeed = useSpeed;
        this.damage = damage;
        this.damageMultiplier = damageMultiplier;
        this.useSpeedMultiplier = useSpeedMultiplier;
        this.durabilityMultiplier = durabilityMultiplier;
    }
}