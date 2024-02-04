import { Server, Socket } from "socket.io";
import { existsSync, readFileSync, writeFileSync } from "fs";
import World, { createWorld } from "./classes/world";
import User from "./user";
import Player from "./classes/creatures/others/player";
import Creature, { CreatureSaveFormat } from "./classes/creature";
import { EventEmitter, isInChunk } from "./classes/utils";
import { ItemType } from "./classes/item";

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
    users: User[] = [];

    // tick event updater
    updater:{[key:string]:any}[] = [];
    remove:string[] = [];
    add:{[key:string]:any}[] = [];

    // server data
    bannedID: string[] = [];
    bannedIP: string[] = [];

    world: World
    events: EventEmitter = new EventEmitter();

    constructor(config:ServerConfig) {
        this.name = config.name;
        this.description = config.description;
        this.date = config.date;
        this.maxPlayers = config.maxPlayers;
        this.socket = config.socket;
        if(config.file) {
            if(existsSync(config.file)){
                let world = JSON.parse(readFileSync(config.file).toString());
                this.bannedID = world.bannedID;
                this.bannedIP = world.bannedIP;
                this.world = new World(world.resources, world.creatures, world.projectiles, world.vehicles, world.structures, world.regions, world.time, world.weather, world.spawnTick, world.maxWildLevel);
            } else {
                this.world = createWorld();
            }
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
            onlineplayers: this.users.length,
        };
    }

    start(){
        this.world.init();
        this.socket.on('connection', (socket:Socket) => {
            // ingame
            socket.on('init', (data:{name:string;email:string;uuid:string}) => {
                // player connection
                console.log('a user connected', socket.handshake.address);
                // ban & kick
                const kickPlayer = (reason:string) => {
                    socket.emit('kick', reason);
                    socket.disconnect();
                }
                if(this.users.find((player) => player.uuid === data.uuid)) return kickPlayer('You are already connected to this server!');
                if(this.bannedIP.includes(socket.handshake.address)) return kickPlayer('You are banned from this server!');
                if(this.bannedID.includes(data.uuid)) return kickPlayer('You are banned from this server!');
                // accept player
                this.users.push(new User(data.name, data.email, data.uuid, socket.id, socket.handshake.address));

                // check player exists in world
                let player:Player = this.world.getWorldObjects().creatures.find((creature) => creature.uuid == data.uuid) as Player;
                if(!player) {
                    let spawn = this.world.getSpawn();
                    // create player
                    player = new Player(spawn.x, spawn.y, 1, 0, data.name, data.uuid);
                    this.world.addCreature(player);
                }
                socket.emit('init', {
                    player: player.getSaveFormat(),
                    ...this.world.getWorldObjectsByChunk(player.x, player.y),
                });

                socket.on('chat', (message:string) => {
                    this.chat.push(message);
                    socket.emit('chat', message);
                    socket.broadcast.emit('chat', message);
                });

                // player movement tick
                socket.on('tick', (player:CreatureSaveFormat) => {
                    let curPlayer = (this.world.getWorldObjects().creatures.find(v => v.uuid == player.uuid) as Player)
                    curPlayer.tickUpdate(player.x, player.y, player.dx, player.dy)
                    this.addUpdater(curPlayer.getSaveFormat())
                })

                // server updation tick
                this.on('tick', (updater:{[key:string]:any}[], add:{[key:string]:any}[], remove:string[]) => {
                    let myChar = this.world.getWorldObjects().creatures.find(v => v.uuid == data.uuid) as Player
                    socket.emit('update', {
                        updater:updater.filter((v) => isInChunk(myChar.x, myChar.y, v.x, v.y, 32, 1)),
                        add:add.filter((v) => isInChunk(myChar.x, myChar.y, v.x, v.y, 32, 1)),
                        remove
                    })
                })
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

                this.world.on('spawn', (resources:[], creatures:[]) => {
                    socket.emit('spawn', [resources, creatures]);
                })

                this.world.on('creatureSpawn', (creature:Creature) => {
                    socket.emit('creatureSpawn', creature.getSaveFormat())
                })

                this.on('tick', (updater:{[key:string]:any}[], add:{[key:string]:any}[], remove:string[]) => {
                    socket.emit('update', {updater, add, remove})
                })
            })

            // disconnection
            socket.on('disconnect', () => {
                console.log('user disconnected');
                this.users.splice(this.users.findIndex((player) => player.socketId === socket.id), 1);
            });
        });

        const loop = () => {
            this.world.tick();
            this.socket.emit('tick', {
                time: this.world.time,
                weather: this.world.weather
            });
            this.emit('tick', this.updater, this.add, this.remove)
            this.updater = []
            this.add = []
            this.remove = []
            setTimeout(loop, 1000 / 60);
        };
        loop();
    }

    command(command:string):string {
        let args = command.split(' ');
        let main = args[0];
        switch(main) {
            case '/kick':
                let target = args[1];
                let player = this.users.find((player) => player.uuid === target);
                if(player) {
                    this.socket.to(player.socketId).emit('kick', 'You have been kicked from the server!');
                    this.socket.to(player.socketId).disconnectSockets();
                    return 'Player kicked!';
                } else {
                    return 'Player not found!';
                }
            case '/ban':
                let target2 = args[1];
                let player2 = this.users.find((player) => player.uuid === target2);
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
                let player3 = this.users.find((player) => player.uuid === target3);
                if(player3) {
                    this.socket.to(player3.socketId).emit('kick', 'You have been banned from the server!');
                    this.socket.to(player3.socketId).disconnectSockets();
                    this.banIP(player3.address);
                    return 'Player IP banned!';
                } else {
                    return 'Player not found!';
                }
            case '/getplayerid':
                let target4 = args[1];
                let player4 = this.users.find((player) => player.name === target4);
                if(player4) {
                    return player4.uuid;
                } else {
                    return 'Player not found!';
                }
            case '/save':
                this.saveWorld(args[1]);
                return 'World saved!';
            case '/getcreature':
                let target5 = args[1];
                let target5found = this.world.getWorldObjects().creatures.find((creature) => creature.uuid === target5);
                if(target5found) {
                    return JSON.stringify(target5found.getSaveFormat()).split(',').join(',\n').replace('{', '{\n').replace('}', '\n}').replace('[', '[\n').replace(']', '\n]');
                } else {
                    return 'Creature not found!';
                }
            case '/item':
                let target6:string = args[1];
                if((Object.values(ItemType) as string[]).includes(target6)){
                    // item give
                    return 'Successfully given!'
                } else {
                    return 'ItemType not found!';
                }
            default:
                return 'Unknown command';
        }
    }

    saveWorld(route?:string) {
        console.log('saving world...');
        let world = {
            bannedID: this.bannedID,
            bannedIP: this.bannedIP,
            spawnTick: this.world.spawnTick,
            maxWildLevel: this.world.maxWildLevel,
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

    addUpdater(data:{[key:string]:any}){
        this.updater = [...this.updater.filter(v => v.uuid !== data.uuid), data]
    }

    addAdder(data:{[key:string]:any}){
        this.add = [...this.add.filter(v => v.uuid !== data.uuid), data]
    }

    addRemover(data:string){
        this.remove = [...this.remove, data]
    }

    on(event:string, callback:(...args: any[]) => void){
        this.events.on(event, callback);
    }

    emit(event:string, ...args: any[]){
        this.events.emit(event, ...args);
    }
}