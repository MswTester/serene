import express, { Response } from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import ServerLogic from './logic';

interface ServerConfig{
    name: string;
    description: string;
    date: string;
    maxPlayers: number;
    socket: Server;
    adminPassword: string;
    file?: string;
}

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
    adminPassword: process.env.SERVER_ADMIN_PW || 'admin',
    file: 'worlds/world.json'
};

const server: ServerLogic = new ServerLogic(config);

app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', (_req, res) => {
    res.json({
        online: server.getServerInfo().online,
        name: server.getServerInfo().name,
        description: server.getServerInfo().description,
        date: server.getServerInfo().date,
        maxplayers: server.getServerInfo().maxplayers,
        onlineplayers: server.getServerInfo().onlineplayers,
    });
});

const clearRoute = (string: string): string => {
    return string.replace('\\dist', '').replace('\\src', '').replace('/src', '').replace('/dist', '')
}

app.get('/admin', (req, res) => {
    if(req.query['pw'] == config.adminPassword){
        res.sendFile(clearRoute(__dirname) + '/app/admin.html');
    } else {
        res.send('Wrong Password');
    }
})

httpServer.listen(PORT, () => {
    server.on()
    console.log(`listening on *:${PORT}\nAdmin Password : ${config.adminPassword}`);
});