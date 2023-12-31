import { generateRandomString } from "../utils"

export default class Node{
    id:string
    classer:classes
    type:string
    position:[number, number]
    fields:{[key:string]:string}

    constructor(classer:classes, type:string, pos:[number, number]){
        this.id = generateRandomString(10)
        this.classer = classer
        this.type = type
        this.position = pos
        this.fields = {}
    }
}