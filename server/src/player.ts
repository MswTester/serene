import { EventEmitter } from "events";

export class Player{
    name: string;
    email: string;
    uuid: string;
    socketId: string;
    address: string;
    admin: boolean = false;
    events: EventEmitter;
    constructor(name:string, email:string, uuid:string, socketId:string, address:string, admin?:boolean){
        this.name = name;
        this.email = email;
        this.uuid = uuid;
        this.socketId = socketId;
        this.address = address;
        if(admin) this.admin = admin;
        this.events = new EventEmitter();
    }

    on(event:string, callback:(...args: any[]) => void){
        this.events.on(event, callback);
    }
    emit(event:string, ...args:any[]){
        this.events.emit(event, ...args);
    }
}