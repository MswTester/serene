import { Stage, Container, useApp } from '@pixi/react';
import PIXI, { Filter } from 'pixi.js';
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
    const [filter, setFilter] = useState<Filter[]>([]);
    const [viewport, setViewport] = useState<Point>([0, 0]);
    const [zoom, setZoom] = useState<number>(1);

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

    useInterval(() => {
        if(!socket) return;
        if(!user) return;
        if(!once) return;
        // render
    }, 1000 / 60);

    const PolygonWithTexture: React.FC<{points:Polygon, texture:PIXI.Texture, scale:number}> = ({ points, texture, scale }) => {
        const app = useApp();
        const graphics = new PIXI.Graphics();
      
        useEffect(() => {
            // PixiJS의 drawPolygon은 flat한 배열을 받기 때문에 2차원 배열을 flat하게 변환
            const flatPoints = points.flat();

            texture.baseTexture.setSize(scale, scale); // 텍스쳐 스케일 조절

            graphics.clear();
            graphics.beginTextureFill({ texture: texture });
            graphics.drawPolygon(flatPoints as any); // 타입 캐스팅
            graphics.endFill();

            app.stage.addChild(graphics);

            return () => {
                app.stage.removeChild(graphics);
            };
        }, [points, texture, scale, app.stage, graphics]); // scale 의존성 추가

        return null;
    };

    return <>
        {gamePage === 'loading' ? <div className="absolute top-0 left-0 w-full h-full bg-black flex justify-center items-center" style={{backgroundImage: `url(assets/loadingbg.png)`}}>
            <div className="text-white text-4xl">Loading...</div>
        </div>:

        gamePage === 'game' ? <Stage width={width} height={height}>
            <Container pivot={[0.5/width, 0.5/height]}>
                
            </Container>
        </Stage>:
        <></>
        }
    </>
}