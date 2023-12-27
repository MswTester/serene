import { Server, Socket } from "socket.io";
import { readFileSync, write, writeFileSync } from "fs";
import World, { createWorld } from "./classes/world";
import Player from "./player";

interface ServerConfig{
    name: string;
    description: string;
    date: string;
    maxPlayers: number;
    socket: Server;
    adminPassword: string;
    file?: string;
}

export default class ServerLogic {
    name: string = 'Serene Server';
    description: string = 'Hello World!';
    date: string = new Date().toLocaleDateString();
    maxPlayers: number = 100;
    socket:Server;
    chat: string[] = [];
    players: Player[] = [];

    // server data
    bannedID: string[] = [];
    bannedIP: string[] = [];

    world: World

    constructor(config:ServerConfig) {
        this.name = config.name;
        this.description = config.description;
        this.date = config.date;
        this.maxPlayers = config.maxPlayers;
        this.socket = config.socket;
        if(config.file) {
            let world = JSON.parse(readFileSync(config.file).toString());
            this.bannedID = world.bannedID;
            this.bannedIP = world.bannedIP;
            this.world = new World(world.resources, world.creatures, world.projectiles, world.vehicles, world.structures, world.regions, world.time, world.weather);
        } else {
            this.world = createWorld();
        }
    }

    getServerInfo() {
        return {
            online: true,
            name: this.name,
            description: this.description,
            date: this.date,
            maxplayers: this.maxPlayers,
            onlineplayers: this.players.length,
        };
    }

    on(){
        this.socket.on('connection', (socket:Socket) => {
            console.log('a user connected', socket.handshake.address);

            // ingame
            socket.on('init', (data:{name:string;email:string;uuid:string}) => {
                this.players.push(new Player(data.name, data.email, data.uuid, socket.id, socket.handshake.address));
                if(this.bannedIP.includes(socket.handshake.address)) {
                    socket.emit('kick', 'You are banned from this server!');
                    socket.disconnect();
                    return;
                }
                if(this.bannedID.includes(data.uuid)) {
                    socket.emit('kick', 'You are banned from this server!');
                    socket.disconnect();
                    return;
                }
                socket.emit('init', this.world.getWorldSaveFormat());
            });

            // admin
            socket.on('admin', () => {
                console.log('admin connected');
                socket.emit('admin', this.world.getWorldSaveFormat());

                socket.on('command', (command:string) => {
                    socket.emit('command-response', this.command(command))
                })

                socket.on('chat', (message:string) => {
                    this.chat.push(message);
                    socket.emit('chat', message);
                    socket.broadcast.emit('chat', message);
                });
            })

            // disconnection
            socket.on('disconnect', () => {
                console.log('user disconnected');
                this.players.splice(this.players.findIndex((player) => player.socketId === socket.id), 1);
            });
        });
        const loop = () => {
            this.world.tick();
            this.socket.emit('tickUpdate', {
                time: this.world.time,
                weather: this.world.weather,
            });
            setTimeout(loop, 1000 / 60);
        };
        loop();

        this.world.on('spawn', (resources:[], creatures:[]) => {
            console.log('spawning...');
            this.socket.emit('spawn', [resources, creatures]);
        })
    }

    command(command:string):string {
        let args = command.split(' ');
        let main = args[0];
        switch(main) {
            case '/kick':
                let target = args[1];
                let player = this.players.find((player) => player.uuid === target);
                if(player) {
                    this.socket.to(player.socketId).emit('kick', 'You have been kicked from the server!');
                    this.socket.to(player.socketId).disconnectSockets();
                    return 'Player kicked!';
                } else {
                    return 'Player not found!';
                }
            case '/ban':
                let target2 = args[1];
                let player2 = this.players.find((player) => player.uuid === target2);
                if(player2) {
                    this.socket.to(player2.socketId).emit('kick', 'You have been banned from the server!');
                    this.socket.to(player2.socketId).disconnectSockets();
                    this.banPlayer(player2.uuid);
                    return 'Player banned!';
                } else {
                    return 'Player not found!';
                }
            case '/ipban':
                let target3 = args[1];
                let player3 = this.players.find((player) => player.uuid === target3);
                if(player3) {
                    this.socket.to(player3.socketId).emit('kick', 'You have been banned from the server!');
                    this.socket.to(player3.socketId).disconnectSockets();
                    this.banIP(player3.address);
                    return 'Player IP banned!';
                } else {
                    return 'Player not found!';
                }
            case 'getPlayerId':
                let target4 = args[1];
                let player4 = this.players.find((player) => player.name === target4);
                if(player4) {
                    return player4.uuid;
                } else {
                    return 'Player not found!';
                }
            case '/save':
                this.saveWorld(args[1]);
                return 'World saved!';
            default:
                return 'Unknown command';
        }
    }

    saveWorld(route?:string) {
        console.log('saving world...');
        let world = {
            bannedID: this.bannedID,
            bannedIP: this.bannedIP,
            ...this.world.getWorldSaveFormat(),
        };
        writeFileSync(`./worlds/${route || 'world.json'}`, JSON.stringify(world), 'utf8');
        console.log('world saved!');
    }

    banPlayer(uuid:string) {
        this.bannedID.push(uuid);
    }

    banIP(ip:string) {
        this.bannedIP.push(ip);
    }
}