import { Stage, Container, Graphics, Sprite } from '@pixi/react';
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
    Scaling:100,
    tileScaling:100,
}

export default function Index() {
    const { width, height } = useWindowSize();
    const { lang, user, socket, setSocket, setPage } = useContext(globalContext);
    const [screenScale, setScreenScale] = useState(Math.max(width / 1920, height / 1080));
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
    const [rotation, setRotation] = useState<number>(0);
    const [keyMap, setKeyMap] = useState<string[]>([]);
    const [renders, setRenders] = useState<(Creature)[]>([]);

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

            socket.on('tick', (data:{
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
            socket.off('tick');
        }
    }, [once]);

    useEffect(() => {
        const keyDown = (e:KeyboardEvent) => {
            setKeyMap([...keyMap, e.code]);
        }
        const keyUp = (e:KeyboardEvent) => {
            setKeyMap(keyMap.filter(v => v !== e.code));
        }
        document.addEventListener('keydown', keyDown);
        document.addEventListener('keyup', keyUp);
        return () => {
            document.removeEventListener('keydown', keyDown);
            document.removeEventListener('keyup', keyUp);
        }
    }, [keyMap]);

    useInterval(() => {
        if(!socket) return;
        if(!me) return;
        if(!once) return;
        setScreenScale(Math.max(width / 1920, height / 1080));
        setViewport([me.x, me.y]);
        setMe(me => {
            me = (me as Player)
            let speed = me.baseSpeed[0]/40
            if(keyMap.includes('KeyW')) me.dy = -speed;
            else if(keyMap.includes('KeyS')) me.dy = speed;
            else me.dy = 0;
            if(keyMap.includes('KeyA')) me.dx = -speed;
            else if(keyMap.includes('KeyD')) me.dx = speed;
            else me.dx = 0;
            me.update();
            return me;
        })
        socket.emit('tick', me.getSaveFormat())
    }, 1000 / 60);

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
                <Container pivot={[viewport[0]*globalConfig.Scaling*screenScale - width/2, viewport[1]*globalConfig.Scaling*screenScale - height/2]}
                scale={zoom} rotation={rotation} anchor={0.5}>
                    <Graphics draw={graphics => {
                        graphics.clear();
                        regions.forEach(region => {
                            const texture = PIXI.Texture.from(`assets/${region.src}.png`);
                            texture.baseTexture.setSize(globalConfig.tileScaling*screenScale, globalConfig.tileScaling*screenScale);
                            const polygon = sizingPolygon(region.polygon, globalConfig.Scaling*screenScale)
                            createTexturedPolygon(graphics, texture, polygon);
                        });
                    }} />
                    {resources.sort((a, b) => a.y - b.y).map(v => {
                        return <Sprite source={`assets/${v.src}.png`}
                        width={v.width*v.offsetWidth*globalConfig.Scaling*screenScale}
                        height={v.height*v.offsetHeight*globalConfig.Scaling*screenScale}
                        position={[v.x*globalConfig.Scaling*screenScale, v.y*globalConfig.Scaling*screenScale]}
                        anchor={[0.5, (2*v.offsetHeight-1)/(2*v.offsetHeight)]}
                        ></Sprite>
                    })}
                    {creatures.sort((a, b) => a.y - b.y).map(v => {
                        return <Sprite source={`assets/${v.src}-${v.direction}-${v.state}.png`}
                        width={v.width*v.offsetWidth*globalConfig.Scaling*screenScale}
                        height={v.height*v.offsetHeight*globalConfig.Scaling*screenScale}
                        position={[v.x*globalConfig.Scaling*screenScale, v.y*globalConfig.Scaling*screenScale]}
                        anchor={[0.5, (2*v.offsetHeight-1)/(2*v.offsetHeight)]}
                        ></Sprite>
                    })}
                    {vehicles.sort((a, b) => a.y - b.y).map(v => {
                        return <Sprite source={`assets/${v.src}-${v.direction}.png`}
                        width={v.width*v.offsetWidth*globalConfig.Scaling*screenScale}
                        height={v.height*v.offsetHeight*globalConfig.Scaling*screenScale}
                        position={[v.x*globalConfig.Scaling*screenScale, v.y*globalConfig.Scaling*screenScale]}
                        anchor={[0.5, (2*v.offsetHeight-1)/(2*v.offsetHeight)]}
                        ></Sprite>
                    })}
                    {structures.sort((a, b) => a.y - b.y).map(v => {
                        return <Sprite source={`assets/${v.src}.png`}
                        width={v.width*v.offsetWidth*globalConfig.Scaling*screenScale}
                        height={v.height*v.offsetHeight*globalConfig.Scaling*screenScale}
                        position={[v.x*globalConfig.Scaling*screenScale, v.y*globalConfig.Scaling*screenScale]}
                        anchor={[0.5, (2*v.offsetHeight-1)/(2*v.offsetHeight)]}
                        ></Sprite>
                    })}
                    {projectiles.sort((a, b) => a.y - b.y).map(v => {
                        return <Sprite source={`assets/${v.src}.png`}
                        width={v.width*v.offsetWidth*globalConfig.Scaling*screenScale}
                        height={v.height*v.offsetHeight*globalConfig.Scaling*screenScale}
                        position={[v.x*globalConfig.Scaling*screenScale, v.y*globalConfig.Scaling*screenScale]}
                        anchor={[0.5, (2*v.offsetHeight-1)/(2*v.offsetHeight)]}
                        rotation={v.rotation/180*Math.PI}
                        ></Sprite>
                    })}
                </Container>
            </Stage>
            <div className='absolute left-0 top-0 bg-[#00000055] rounded-md text-white'>
                <input type="number" name="" id="" className='bg-transparent border border-white border-1 focus:outline-none' value={zoom} onChange={e => setZoom(+e.target.value)} />
                <input type="number" name="" id="" className='bg-transparent border border-white border-1 focus:outline-none' value={rotation} onChange={e => setRotation(+e.target.value)} />
                <br />
                {screenScale}
            </div>
        </>:
        <></>
        }
    </>
}

const sizingPolygon = (polygon:Point[], size:number):Point[] => {
    return polygon.map((v) => [v[0]*size, v[1]*size]);
}