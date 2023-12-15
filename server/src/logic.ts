import { Server } from "socket.io";
import { ServerConfig } from "./types";
import { readFileSync, write, writeFileSync } from "fs";
import { Entity } from "./entities";
import { Resource } from "./resources";
import { Structure } from "./structures";
import { Player } from "./player";
import { Terrain } from "./terrain";

export default class ServerLogic {
    name: string = 'Serene Server';
    description: string = 'Hello World!';
    date: string = new Date().toLocaleDateString();
    socket:Server;
    maxPlayers: number = 100;
    players: Player[] = [];
    entities: Entity[] = [];
    resources: Resource[] = [];
    structures: Structure[] = [];
    terrain: Terrain[] = [];
    bannedID: string[] = [];
    bannedIP: string[] = [];
    time: number = 0;
    weather: number = 0;
    constructor(config:ServerConfig) {
        this.name = config.name;
        this.description = config.description;
        this.date = config.date;
        this.maxPlayers = config.maxPlayers;
        this.socket = config.socket;
        if(config.file) {
            let world = JSON.parse(readFileSync(config.file).toString());
            this.players = world.players;
            this.entities = world.entities;
            this.resources = world.resources;
            this.structures = world.structures;
            this.terrain = world.terrain;
            this.bannedID = world.bannedID;
            this.bannedIP = world.bannedIP;
            this.time = world.time;
            this.weather = world.weather;
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
        this.socket.on('connection', (socket) => {
            console.log('a user connected', socket.handshake.address);
            if(this.bannedIP.includes(socket.handshake.address)) {
                socket.emit('kick', 'You are banned from this server!');
                socket.disconnect();
                return;
            }
            this.players.push(new Player('', '', '', socket.id, socket.handshake.address));

            socket.on('init', (data) => {
                if(this.bannedID.includes(data.uuid)) {
                    socket.emit('kick', 'You are banned from this server!');
                    socket.disconnect();
                    return;
                }
                this.players[this.players.findIndex((player) => player.socketId === socket.id)].name = data.name;
                this.players[this.players.findIndex((player) => player.socketId === socket.id)].email = data.email;
                this.players[this.players.findIndex((player) => player.socketId === socket.id)].uuid = data.uuid;
                socket.emit('init', {
                    world: {
                        time: this.time,
                        weather: this.weather,
                    },
                    player: this.players[this.players.findIndex((player) => player.socketId === socket.id)],
                    entities: this.entities,
                    resources: this.resources,
                    structures: this.structures,
                });
            })

            socket.on('disconnect', () => {
                console.log('user disconnected');
                this.players.splice(this.players.findIndex((player) => player.socketId === socket.id), 1);
            });
            socket.on('chat message', (msg) => {
                console.log('message: ' + msg);
            });
        });
        const loop = () => {
            this.time++;
            this.socket.emit('tickUpdate', {
                time: this.time,
                weather: this.weather,
            });
            this.entities.forEach((entity) => {
                entity.tick();
            });
            this.resources.forEach((resource) => {
                resource.tick();
            });
            setTimeout(loop, 1000 / 60);
        };
        loop();
    }

    saveWorld() {
        console.log('saving world...');
        let world = {
            players: this.players,
            entities: this.entities,
            resources: this.resources,
            structures: this.structures,
            terrain: this.terrain,
            bannedID: this.bannedID,
            bannedIP: this.bannedIP,
            time: this.time,
            weather: this.weather,
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