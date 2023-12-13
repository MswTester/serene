import { ServerConfig } from "./types";
import Player from "./entity/player";

export default class ServerLogic {
    name: string = 'Server Server';
    description: string = 'Hello World!';
    date: string = new Date().toLocaleDateString();
    maxPlayers: number = 100;
    players: Player[] = [];
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
    }

    addPlayer(player: Player) {
        this.players.push(player);
    }

    removePlayer(player: Player) {
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
}