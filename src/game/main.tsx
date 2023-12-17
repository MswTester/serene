import { Stage, Container } from '@pixi/react';
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useWindowSize, useInterval } from 'usehooks-ts';
import { globalContext } from '../App';

export default function Index() {
    const { width, height } = useWindowSize();
    const { lang, user, socket, setSocket, setPage } = useContext(globalContext);
    const [terrain, setTerrain] = useState<number[][]>([]);
    const [player, setPlayer] = useState<any[]>([]);
    const [entities, setEntities] = useState<any[]>([]);
    const [resources, setResources] = useState<any[]>([]);
    const [structures, setStructures] = useState<any[]>([]);
    const [time, setTime] = useState(0);
    const [weather, setWeather] = useState(0);
    const [chat, setChat] = useState<any[]>([]);

    useEffect(() => {
        socket.emit('init', {
            name: user.displayName,
            email: user.email,
            uuid: user.uid,
        })
        socket.on('kick', (reason:string) => {
            alert(reason);
            setSocket(null);
            setPage('menu')
        });
        socket.on('init', (data:{
            terrain:number[][];
            player:any[];
            entities:any[];
            resources:any[];
            structures:any[];
        }) => {
            setTerrain(data.terrain);
            setPlayer(data.player);
            setEntities(data.entities);
            setResources(data.resources);
            setStructures(data.structures);
        });
        socket.on('tickUpdate', (data:{
            time:number;
            weather:number;
        }) => {
            setTime(data.time);
            setWeather(data.weather);
        });
    }, []);
    return <Stage width={width} height={height}>
        <Container></Container>
    </Stage>
}