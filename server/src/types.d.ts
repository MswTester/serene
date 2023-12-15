import { Server } from "socket.io";

export interface ServerConfig{
    name: string;
    description: string;
    date: string;
    maxPlayers: number;
    socket: Server;
    file?: string;
}


export interface Transform{
    x: number;
    y: number;
    width: number;
    height: number;
}