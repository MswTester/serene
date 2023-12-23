import { Stage, Container } from '@pixi/react';
import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useWindowSize, useInterval } from 'usehooks-ts';
import { globalContext } from '../App';
import Resource from '../../server/src/classes/resource';
import Creature from '../../server/src/classes/creature';
import Projectile from '../../server/src/classes/projectile';
import Vehicle from '../../server/src/classes/vehicle';
import Structure from '../../server/src/classes/structure';
import Region from '../../server/src/classes/region';

export default function Index() {
    const { width, height } = useWindowSize();
    const { lang, user, socket, setSocket, setPage } = useContext(globalContext);
    // Server variables
    const [resources, setResources] = useState<Resource[]>([]);
    const [creatures, setCreatures] = useState<Creature[]>([]);
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [structures, setStructures] = useState<Structure[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [time, setTime] = useState(0);
    const [weather, setWeather] = useState(0);
    const [chat, setChat] = useState<string[]>([]);
    // Local variables
    const [me, setMe] = useState<Creature>();

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
            resources:Resource[];
            creatures:Creature[];
            projectiles:Projectile[];
            vehicles:Vehicle[];
            structures:Structure[];
            regions:Region[];
        }) => {
            setResources(data.resources);
            setCreatures(data.creatures);
            setProjectiles(data.projectiles);
            setVehicles(data.vehicles);
            setStructures(data.structures);
            setRegions(data.regions);
            let m = data.creatures.find(creature => creature.uuid === user.uid)
            if(m){
                setMe(m);
            } else {
                // need to create my character
            }
        });
        socket.on('tickUpdate', (data:{
            time:number;
            weather:number;
        }) => {
            setTime(data.time);
            setWeather(data.weather);
        });
    }, []);
    return <>
        <Stage width={width} height={height}>
            <Container pivot={[0.5/width, 0.5/height]}>
                
            </Container>
        </Stage>
    </>
}
