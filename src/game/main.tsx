import { Stage, Container } from '@pixi/react';
import { useContext, useEffect, useState } from 'react';
import { useWindowSize } from 'usehooks-ts';
import { globalContext } from '../App';
import Resource, { ResourceSaveFormat } from '../../server/src/classes/resource';
import Creature, { CreatureSaveFormat } from '../../server/src/classes/creature';
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
    const [me, setMe] = useState<Player>();

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
            resources:ResourceSaveFormat[];
            creatures:CreatureSaveFormat[];
            projectiles:ProjectileSaveFormat[];
            structures:StructureSaveFormat[];
            vehicles:VehicleSaveFormat[];
            regions:RegionSaveFormat[];
        }) => {
            let resources = data.resources.map(v => createResource(v.type, v.x, v.y, v.uuid, v.health))
            let creatures = data.creatures.map(v => createCreature(v.type, v.x, v.y, v.level, v.exp, v.uuid, v.dx, v.dy, v.direction, v.state, v.health, v.food, v.inventory, v.isTamed, v.ownerId, v.ownerGuildId, v.guildId))
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
            let m = creatures.find(creature => creature.uuid === user.uid && creature instanceof Player) as Player;
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

        return () => {
            socket.off('kick');
            socket.off('init');
            socket.off('tickUpdate');
        }
    }, []);
    return <>
        <Stage width={width} height={height}>
            <Container pivot={[0.5/width, 0.5/height]}>
                
            </Container>
        </Stage>
    </>
}
