import { Server } from "socket.io";
import { ServerConfig } from "./types";
import { readFileSync, write, writeFileSync } from "fs";

export default class ServerLogic {
    name: string = 'Server Server';
    description: string = 'Hello World!';
    date: string = new Date().toLocaleDateString();
    socket:Server;
    maxPlayers: number = 100;
    players: any[] = [];
    entities: any[] = [];
    resources: any[] = [];
    structures: any[] = [];
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
            this.time = world.time;
            this.weather = world.weather;
        }
    }

    addPlayer(player:any) {
        this.players.push(player);
    }

    removePlayer(player:any) {
        this.players = this.players.filter(p => p !== player);
    }

    getServerInfo() {
        return {
            online: true,
            name: this.name,
            description: this.description,
            date: this.date,
            maxplayers: this.maxPlayers,
            onlineplayers: this.players.filter(v => v.online).length,
        };
    }

    on(){
        this.socket.on('connection', (socket) => {
            console.log('a user connected');
            socket.on('disconnect', () => {
                console.log('user disconnected');
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
            setTimeout(loop, 1000 / 60);
        };
    }

    saveWorld() {
        console.log('saving world...');
        let world = {
            players: this.players,
            entities: this.entities,
            resources: this.resources,
            structures: this.structures,
            time: this.time,
            weather: this.weather,
        };
        writeFileSync('./world.json', JSON.stringify(world));
        console.log('world saved!');
    }
}