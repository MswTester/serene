export class Player{
    name: string;
    email: string;
    uuid: string;
    socketId: string;
    address: string;
    admin: boolean = false;
    constructor(name:string, email:string, uuid:string, socketId:string, address:string){
        this.name = name;
        this.email = email;
        this.uuid = uuid;
        this.socketId = socketId;
        this.address = address;
    }
}