import { Stage, Container, Graphics } from '@pixi/react';
import * as PIXI from 'pixi.js';
import { FC, useContext, useEffect, useRef, useState } from 'react';
import { useInterval, useWindowSize } from 'usehooks-ts';
import { globalContext } from '../App';
import Resource, { ResourceSaveFormat } from '../../server/src/classes/resource';
import Creature, { CreatureSaveFormat, CreatureType } from '../../server/src/classes/creature';
import Projectile, { ProjectileSaveFormat } from '../../server/src/classes/projectile';
import Vehicle, { VehicleSaveFormat } from '../../server/src/classes/vehicle';
import Structure, { StructureSaveFormat } from '../../server/src/classes/structure';
import Region, { RegionSaveFormat } from '../../server/src/classes/region';
import { createResource } from '../../server/src/classes/creation/createResource';
import { createCreature } from '../../server/src/classes/creation/createCreature';
import { createProjectile } from '../../server/src/classes/creation/createProjectile';
import { createStructure } from '../../server/src/classes/creation/createStructure';
import { createVehicle } from '../../server/src/classes/creation/createVehicle';
import { createRegion } from '../../server/src/classes/creation/createRegion';
import Player from '../../server/src/classes/creatures/others/player';

const globalConfig = {
    tileSize:70,
}

export default function Index() {
    const { width, height } = useWindowSize();
    const { lang, user, socket, setSocket, setPage } = useContext(globalContext);
    // Server variables
    const [resources, setResources] = useState<Resource[]>([]);
    const [creatures, setCreatures] = useState<Creature[]>([]);
    const [projectiles, setProjectiles] = useState<Projectile[]>([]);
    const [structures, setStructures] = useState<Structure[]>([]);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [regions, setRegions] = useState<Region[]>([]);
    const [time, setTime] = useState(0);
    const [weather, setWeather] = useState(0);
    const [chat, setChat] = useState<string[]>([]);
    // Local variables
    const [once, setOnce] = useState(false);
    const [me, setMe] = useState<Player>();
    const [gamePage, setGamePage] = useState<string>('loading');
    const [filter, setFilter] = useState<PIXI.Filter[]>([]);
    const [viewport, setViewport] = useState<Point>([0, 0]);
    const [zoom, setZoom] = useState<number>(1);
    // const app = useApp();

    useEffect(() => {
        setOnce(true);
    }, []);

    useEffect(() => {
        if(!socket) return;
        if(!user) return;
        if(!once) return;
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
            player:CreatureSaveFormat;
            resources:ResourceSaveFormat[];
            creatures:CreatureSaveFormat[];
            projectiles:ProjectileSaveFormat[];
            structures:StructureSaveFormat[];
            vehicles:VehicleSaveFormat[];
            regions:RegionSaveFormat[];
        }) => {
            let resources = data.resources.map(v => createResource(v.type, v.x, v.y, v.uuid, v.health))
            let creatures = data.creatures.filter(v => v.uuid !== data.player.uuid).map(v => createCreature(v.type, v.x, v.y, v.level, v.exp, v.uuid, v.dx, v.dy, v.direction, v.state, v.health, v.food, v.inventory, v.isTamed, v.ownerId, v.ownerGuildId, v.guildId, v.name))
            let projectiles = data.projectiles.map(v => createProjectile(v.type, v.x, v.y, v.dx, v.dy, v.rotation, v.ownerId, v.damageMultiplier, v.uuid))
            let structures = data.structures.map(v => createStructure(v.type, v.x, v.y, v.ownerId, v.ownerGuildId, v.uuid, v.health))
            let vehicles = data.vehicles.map(v => createVehicle(v.type, v.x, v.y, v.ownerId, v.ownerGuildId, v.uuid, v.health, v.fuel))
            let regions = data.regions.map(v => createRegion(v.type, v.polygon))
            setResources(resources);
            setCreatures(creatures);
            setProjectiles(projectiles);
            setStructures(structures);
            setVehicles(vehicles);
            setRegions(regions);
            setMe(new Player(data.player.x, data.player.y, data.player.level, data.player.exp, data.player.name, data.player.uuid, data.player.dx, data.player.dy, data.player.direction, data.player.state, data.player.health, data.player.food, data.player.inventory, data.player.guildId));

            setGamePage('game');

            socket.on('tickUpdate', (data:{
                time:number;
                weather:number;
            }) => {
                setTime(data.time);
                setWeather(data.weather);
            });
        });

        return () => {
            socket.off('kick');
            socket.off('init');
            socket.off('tickUpdate');
        }
    }, [once]);

    const createTexturedPolygon = (graphics:PIXI.Graphics, texture:PIXI.Texture, points:Point[]) => {
        const polygon = points.map(([x, y]) => new PIXI.Point(x, y));
        graphics.beginTextureFill({ texture });
        graphics.drawPolygon(polygon);
        graphics.endFill();
    };

    return <>
        {gamePage === 'loading' ? <div className="absolute top-0 left-0 w-full h-full bg-black flex justify-center items-center" style={{backgroundImage: `url(assets/loadingbg.png)`}}>
            <div className="text-white text-4xl">Loading...</div>
        </div>:

        gamePage === 'game' ? <>
            <Stage width={width} height={height}>
                <Container pivot={[0.5/width, 0.5/height]} scale={zoom}>
                    <Graphics draw={graphics => {
                        graphics.clear();
                        regions.forEach(region => {
                            // const texture = Texture.from(`assets/${region.src}.png`);
                            const texture = PIXI.Texture.from(`assets/regions/test.png`);
                            texture.baseTexture.setSize(globalConfig.tileSize*zoom, globalConfig.tileSize*zoom);
                            const polygon = sizingPolygon(region.polygon, 0.1)
                            createTexturedPolygon(graphics, texture, polygon);
                        });
                    }} />
                </Container>
            </Stage>
            <div className='absolute left-0 top-0 bg-[#00000055] rounded-md text-white'>
                <input type="number" name="" id="" className='bg-transparent border border-white border-1 focus:outline-none' value={zoom} onChange={e => setZoom(+e.target.value)} />
                <input type="number" name="" id="" className='bg-transparent border border-white border-1 focus:outline-none' value={viewport[0]} onChange={e => setViewport([+e.target.value, viewport[1]])} />
                <input type="number" name="" id="" className='bg-transparent border border-white border-1 focus:outline-none' value={viewport[1]} onChange={e => setViewport([viewport[0], +e.target.value])} />
                <br />
            </div>
        </>:
        <></>
        }
    </>
}

const sizingPolygon = (polygon:Point[], size:number):Point[] => {
    return polygon.map((v) => [v[0]*size, v[1]*size]);
}