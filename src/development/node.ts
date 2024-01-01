import { generateRandomString } from "../utils"

export class Node{
    id:string;
    classer:string;
    type:string;
    position:[number, number];
    fields:{key:string, value:string}[];
    children:string[];
    thumbnail:string;

    constructor(classer:string, type:string, pos:[number, number], id?:string, fields?:{key:string, value:string}[], children?:string[], thumbnail?:string){
        this.id = id || generateRandomString(10)
        this.classer = classer
        this.type = type
        this.position = pos
        this.fields = fields || []
        this.children = children || []
        this.thumbnail = thumbnail || ""
    }
}