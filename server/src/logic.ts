import { Server } from "socket.io";
import { ServerConfig, Transform } from "./types";
import { readFileSync, write, writeFileSync } from "fs";
import { Entity } from "./entities";
import { Resource } from "./resources";
import { Structure } from "./structures";
import { Player } from "./player";
import { Region } from "./region";

export default class ServerLogic {
    name: string = 'Serene Server';
    description: string = 'Hello World!';
    date: string = new Date().toLocaleDateString();
    maxPlayers: number = 100;
    socket:Server;
    regions: Region[] = [];
    players: Player[] = [];
    entities: Entity[] = [];
    resources: Resource[] = [];
    structures: Structure[] = [];
    bannedID: string[] = [];
    bannedIP: string[] = [];
    time: number = 0;
    weather: number = 0;
    chat: string[] = [];
    constructor(config:ServerConfig) {
        this.name = config.name;
        this.description = config.description;
        this.date = config.date;
        this.maxPlayers = config.maxPlayers;
        this.socket = config.socket;
        if(config.file) {
            let world = JSON.parse(readFileSync(config.file).toString());
            this.entities = world.entities;
            this.resources = world.resources;
            this.structures = world.structures;
            this.regions = world.regions;
            this.bannedID = world.bannedID;
            this.bannedIP = world.bannedIP;
            this.time = world.time;
            this.weather = world.weather;
        }

        this.entities.forEach((entity) => {
            entity.on('destroy', () => {
                this.removeEntity(entity);
            });
        });
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

            socket.on('init', (data) => {
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
                    entities: this.entities,
                    resources: this.resources,
                    structures: this.structures,
                });
            });
            socket.on('disconnect', () => {
                console.log('user disconnected');
                this.players.splice(this.players.findIndex((player) => player.socketId === socket.id), 1);
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
            this.regions.forEach((region) => {
                region.tick(1000 / 60, this);
            });
            setTimeout(loop, 1000 / 60);
        };
        loop();
    }

    getCollisions() {
        let collisions:Transform[] = [];
        collisions.concat(this.resources.filter((resource) => resource.isCollidable).map((resource) => resource.getTransform()));
        collisions.concat(this.structures.filter((structure) => structure.isCollidable).map((structure) => structure.getTransform()));
        return collisions;
    }

    addEntity(entity:Entity) {
        this.entities.push(entity);
        entity.on('destroy', () => {
            this.removeEntity(entity);
        });
    }

    addResource(resource:Resource) {
        this.resources.push(resource);
        resource.on('destroy', () => {
            this.removeResource(resource);
        });
    }

    addStructure(structure:Structure) {
        this.structures.push(structure);
        structure.on('destroy', () => {
            this.removeStructure(structure);
        });
    }

    removeEntity(entity:Entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {this.entities.splice(index, 1);}
    }

    removeResource(resource:Resource) {
        const index = this.resources.indexOf(resource);
        if (index !== -1) {this.resources.splice(index, 1);}
    }

    removeStructure(structure:Structure) {
        const index = this.structures.indexOf(structure);
        if (index !== -1) {this.structures.splice(index, 1);}
    }

    saveWorld() {
        console.log('saving world...');
        let world = {
            entities: this.entities,
            resources: this.resources,
            structures: this.structures,
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