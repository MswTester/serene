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
    const [renders, setRenders] = useState<RenderObject[]>([]);
    const [delta, setDelta] = useState<number>(0);
    const [lastTime, setLastTime] = useState<number>(Date.now());

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

        // connection init
        socket.on('init', (data:{
            player:CreatureSaveFormat;
            resources:ResourceSaveFormat[];
            creatures:CreatureSaveFormat[];
            projectiles:ProjectileSaveFormat[];
            structures:StructureSaveFormat[];
            vehicles:VehicleSaveFormat[];
            regions:RegionSaveFormat[];
        }) => {
            let vresources = data.resources.map(v => createResource(v.type, v.x, v.y, v.uuid, v.health))
            let vcreatures = data.creatures.filter(v => v.uuid !== data.player.uuid).map(v => createCreature(v.type, v.x, v.y, v.level, v.exp, v.uuid, v.dx, v.dy, v.direction, v.state, v.health, v.food, v.inventory, v.isTamed, v.ownerId, v.ownerGuildId, v.guildId, v.name))
            let vprojectiles = data.projectiles.map(v => createProjectile(v.type, v.x, v.y, v.dx, v.dy, v.rotation, v.ownerId, v.damageMultiplier, v.uuid))
            let vstructures = data.structures.map(v => createStructure(v.type, v.x, v.y, v.ownerId, v.ownerGuildId, v.uuid, v.health))
            let vvehicles = data.vehicles.map(v => createVehicle(v.type, v.x, v.y, v.ownerId, v.ownerGuildId, v.uuid, v.health, v.fuel))
            let vregions = data.regions.map(v => createRegion(v.type, v.polygon))
            setResources(vresources);
            setCreatures(vcreatures);
            setProjectiles(vprojectiles);
            setStructures(vstructures);
            setVehicles(vvehicles);
            setRegions(vregions);
            setMe(new Player(data.player.x, data.player.y, data.player.level, data.player.exp, data.player.name, data.player.uuid, data.player.dx, data.player.dy, data.player.direction, data.player.state, data.player.health, data.player.food, data.player.inventory, data.player.guildId));

            // init on join server
            setGamePage('game');

            socket.on('tick', (data:{
                time:number;
                weather:number;
            }) => {
                setTime(data.time);
                setWeather(data.weather);
            });

            socket.on('chat', (data:string) => {
                setChat(chat => [...chat, data]);
            })

            socket.on('update', (data:{updater:{[key:string]:any}[], add:{[key:string]:any}[], remove:string[]}) => {
                data.updater.forEach(v => {
                    if(v.uuid === (me as Player).uuid) return;
                    let creature = creatures.find(c => c.uuid === v.uuid);
                    if(creature) {
                        creature.update(v as CreatureSaveFormat)
                    }
                    // need to write resources, structures, etc ...
                });
                data.add.forEach(v => {
                    // creation
                    if(v.type in CreatureType){
                        creatures.push(createCreature(v.type, v.x, v.y, v.level, v.exp, v.uuid, v.dx, v.dy, v.direction, v.state, v.health, v.food, v.inventory, v.isTamed, v.ownerId, v.ownerGuildId, v.guildId, v.name))
                    } else if(v.type in Resource){
                        resources.push(createResource(v.type, v.x, v.y, v.uuid, v.health))
                    } else if(v.type in Projectile){
                        projectiles.push(createProjectile(v.type, v.x, v.y, v.dx, v.dy, v.rotation, v.ownerId, v.damageMultiplier, v.uuid))
                    } else if(v.type in Structure){
                        structures.push(createStructure(v.type, v.x, v.y, v.ownerId, v.ownerGuildId, v.uuid, v.health))
                    } else if(v.type in Vehicle){
                        vehicles.push(createVehicle(v.type, v.x, v.y, v.ownerId, v.ownerGuildId, v.uuid, v.health, v.fuel))
                    } else if(v.type in Region){
                        regions.push(createRegion(v.type, v.polygon))
                    }
                });
                data.remove.forEach(v => {
                    if (creatures.find(vv => vv.uuid == v)) creatures.splice(creatures.findIndex(vv => vv.uuid == v), 1);
                    if (resources.find(vv => vv.uuid == v)) resources.splice(resources.findIndex(vv => vv.uuid == v), 1);
                    if (projectiles.find(vv => vv.uuid == v)) projectiles.splice(projectiles.findIndex(vv => vv.uuid == v), 1);
                    if (structures.find(vv => vv.uuid == v)) structures.splice(structures.findIndex(vv => vv.uuid == v), 1);
                    if (vehicles.find(vv => vv.uuid == v)) vehicles.splice(vehicles.findIndex(vv => vv.uuid == v), 1);
                });
            })
        });

        return () => {
            // remove socket listener
            socket.off('kick');
            socket.off('init');
            socket.off('tick');
            socket.off('update')
        }
    }, [once]);

    // render updation         
    useEffect(() => {
        let rdo:RenderObject[] = []
        resources.forEach(v => {rdo.push({src:`assets/${v.src}`, x:v.x, y:v.y, oWidth:v.offsetWidth, oHeight:v.offsetHeight, width:v.width, height:v.height})})
        creatures.forEach(v => {rdo.push({src:`assets/${v.src}_${v.state}`, x:v.x, y:v.y, oWidth:v.offsetWidth, oHeight:v.offsetHeight, width:v.width, height:v.height})})
        projectiles.forEach(v => {rdo.push({src:`assets/${v.src}`, x:v.x, y:v.y, oWidth:v.offsetWidth, oHeight:v.offsetHeight, width:v.width, height:v.height})})
        structures.forEach(v => {rdo.push({src:`assets/${v.src}`, x:v.x, y:v.y, oWidth:v.offsetWidth, oHeight:v.offsetHeight, width:v.width, height:v.height})})
        vehicles.forEach(v => {rdo.push({src:`assets/${v.src}`, x:v.x, y:v.y, oWidth:v.offsetWidth, oHeight:v.offsetHeight, width:v.width, height:v.height})})
        rdo = rdo.sort((a, b) => a.y - b.y)
        setRenders(rdo)
    }, [me, resources, creatures, projectiles, structures, vehicles])

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
        setDelta(Date.now() - lastTime);
        setLastTime(Date.now());
        setScreenScale(Math.max(width / 1920, height / 1080));
        setViewport([me.x - (me.x - viewport[0])/2, viewport[1] + (me.y - viewport[1])/2]);
        setMe(me => {
            me = (me as Player)
            let speed = me.baseSpeed[0]/delta;
            if(keyMap.includes('KeyW')) me.dy = -speed;
            else if(keyMap.includes('KeyS')) me.dy = speed;
            else me.dy = 0;
            if(keyMap.includes('KeyA')) me.dx = -speed;
            else if(keyMap.includes('KeyD')) me.dx = speed;
            else me.dx = 0;
            me.update();
            return me;
        })
        socket.emit('tick', {x:me.x, y:me.y, dx:me.dx, dy:me.dy})
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
                    <Graphics draw={(graphics:PIXI.Graphics) => {
                        graphics.clear();
                        regions.forEach(region => {
                            const texture = PIXI.Texture.from(`assets/${region.src}.png`);
                            texture.baseTexture.setSize(globalConfig.tileScaling*screenScale, globalConfig.tileScaling*screenScale);
                            const polygon = sizingPolygon(region.polygon, globalConfig.Scaling*screenScale)
                            createTexturedPolygon(graphics, texture, polygon);
                        });
                    }} />
                    {renders.sort((a, b) => b.y - a.y).map((v, i) => {
                        return <Sprite
                            source={v.src}
                            width={v.width * v.oWidth * globalConfig.Scaling * screenScale}
                            height={v.height * v.oHeight * globalConfig.Scaling * screenScale}
                            position={[v.x * globalConfig.Scaling * screenScale, v.y * globalConfig.Scaling * screenScale]}
                            anchor={[0.5, (2*v.oHeight-1)/(2*v.oHeight)]}
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