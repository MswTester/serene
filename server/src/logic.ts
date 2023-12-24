import { Server, Socket } from "socket.io";
import { ServerConfig } from "./types";
import { readFileSync, write, writeFileSync } from "fs";
import World, { createWorld } from "./classes/world";
import Player from "./player";

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
                socket.emit('init', {
                    resources: this.world.getWorldObjects().resources,
                    creatures: this.world.getWorldObjects().creatures,
                    projectiles: this.world.getWorldObjects().projectiles,
                    vehicles: this.world.getWorldObjects().vehicles,
                    structures: this.world.getWorldObjects().structures,
                    regions: this.world.getWorldObjects().regions,
                });
            });

            // admin
            socket.on('admin', () => {
                console.log('admin connected');
                socket.emit('admin', {
                    resources: this.world.getWorldObjects().resources,
                    creatures: this.world.getWorldObjects().creatures,
                    projectiles: this.world.getWorldObjects().projectiles,
                    vehicles: this.world.getWorldObjects().vehicles,
                    structures: this.world.getWorldObjects().structures,
                    regions: this.world.getWorldObjects().regions,
                });
            })
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
    }

    saveWorld() {
        console.log('saving world...');
        let world = {
            resources: this.world.getWorldObjects().resources,
            creatures: this.world.getWorldObjects().creatures,
            projectiles: this.world.getWorldObjects().projectiles,
            vehicles: this.world.getWorldObjects().vehicles,
            structures: this.world.getWorldObjects().structures,
            regions: this.world.getWorldObjects().regions,
            bannedID: this.bannedID,
            bannedIP: this.bannedIP,
            time: this.world.time,
            weather: this.world.weather,
        };
        writeFileSync('./world.json', JSON.stringify(world));
        console.log('world saved!');
    }

    banPlayer(uuid:string) {
        this.bannedID.push(uuid);
    }

    banIP(ip:string) {
        this.bannedIP.push(ip);
    }
}