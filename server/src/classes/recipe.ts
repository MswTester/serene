import { ItemType } from "./item";

export default class Recipe{
    readonly autoCraft:boolean;
    readonly materials:{type:ItemType, amount:number}[];
    readonly result:{type:ItemType, amount:number};

    constructor(autoCraft:boolean, materials:{type:ItemType, amount:number}[], result:{type:ItemType, amount:number}){
        this.autoCraft = autoCraft;
        this.materials = materials;
        this.result = result;
    }
}