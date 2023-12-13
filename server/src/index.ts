import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { ServerConfig } from './types';
import ServerLogic from './logic';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        allowedHeaders: ['Access-Control-Allow-Origin'],
    },
});

const PORT = process.env.PORT || 3000;

const config: ServerConfig = {
    name: 'Serene',
    description: 'Serene Server',
    date: new Date().toLocaleDateString(),
    maxPlayers: 100,
    socket: io,
};

const server: ServerLogic = new ServerLogic(config);

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (req, res) => {
    res.json({
        online: server.getServerInfo().online,
        name: server.getServerInfo().name,
        description: server.getServerInfo().description,
        date: server.getServerInfo().date,
        maxplayers: server.getServerInfo().maxplayers,
        onlineplayers: server.getServerInfo().onlineplayers,
    });
});

httpServer.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});