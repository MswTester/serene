import { ItemType } from "./item";

export default class Recipe{
    readonly autoCraft:boolean = false;
    readonly materials:{type:ItemType, amount:number}[];
    readonly result:{type:ItemType, amount:number};
    readonly time:number = 0;

    constructor(autoCraft:boolean, materials:{type:ItemType, amount:number}[], result:{type:ItemType, amount:number}, time:number){
        this.autoCraft = autoCraft;
        this.materials = materials;
        this.result = result;
        this.time = time;
    }
}