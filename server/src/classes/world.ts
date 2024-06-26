import { voronoi } from 'd3-voronoi'
import { EventEmitter } from "events";
import Resource, { ResourceSaveFormat, ResourceType } from "./resource";
import Creature, { CreatureSaveFormat, CreatureType } from "./creature";
import Projectile, { ProjectileSaveFormat } from "./projectile";
import Vehicle, { VehicleSaveFormat } from "./vehicle";
import Structure, { StructureSaveFormat } from "./structure";
import Region, { RegionSaveFormat, RegionType } from "./region";
import { generateSeed, getPosByRot, isInChunk, makeArcSites, makeLineSites, randomFloat, randomInt, seededRandomInt } from "./utils";
import { createCreature } from './creation/createCreature';
import { createRegion } from './creation/createRegion';
import { createResource } from './creation/createResource';
import { createProjectile } from './creation/createProjectile';
import { createStructure } from './creation/createStructure';
import { createVehicle } from './creation/createVehicle';

export default class World{

    // world constants
    spawnTick:number = 36000; // 10 minutes
    maxWildLevel:number = 50;
    mapWidth:number = 10000;
    mapHeight:number = 10000;

    // world data
    time: number = 0;
    weather: number = 0;

    // world objects
    private resources: Resource[] = [];
    private creatures: Creature[] = [];
    private projectiles: Projectile[] = [];
    private vehicles: Vehicle[] = [];
    private structures: Structure[] = [];
    private regions: Region[] = [];

    // events
    events: EventEmitter

    constructor(
        resourceData:ResourceSaveFormat[],
        creatureData:CreatureSaveFormat[],
        projectileData:any[],
        vehicleData:any[],
        structureData:any[],
        regionData:RegionSaveFormat[],
        time:number, weather:number,

        spawnTick?:number,
        maxWildLevel?:number
        ){
        this.resources = resourceData.map(v => createResource(v.type, v.x, v.y, v.uuid, v.health));
        this.creatures = creatureData.map(v => createCreature(v.type, v.x, v.y, v.level, v.exp, v.uuid, v.dx, v.dy, v.direction, v.state, v.health, v.food, v.inventory, v.isTamed, v.ownerId, v.ownerGuildId, v.guildId, v.name));
        this.projectiles = projectileData.map(v => createProjectile(v.type, v.x, v.y, v.dx, v.dy, v.rotation, v.ownerId, v.damageMultiplier, v.uuid));
        this.vehicles = vehicleData.map(v => createVehicle(v.type, v.x, v.y, v.uuid, v.health, v.ownerId, v.ownerGuildId));
        this.structures = structureData.map(v => createStructure(v.type, v.x, v.y, v.ownerId, v.ownerGuildId, v.uuid, v.health));
        this.regions = regionData.map(v => createRegion(v.type, v.polygon));
        this.time = time;
        this.weather = weather;
        this.spawnTick = spawnTick || this.spawnTick;
        this.maxWildLevel = maxWildLevel || this.maxWildLevel;

        this.events = new EventEmitter();
    }

    init(){
        this.spawn(10);
    }

    tick(){
        this.time++;
        if(this.time % this.spawnTick == 0){
            this.spawn();
        }
        this.resources.forEach((resource) => {
            resource.tick(this);
        });
        this.structures.forEach((structure) => {
            structure.tick(this);
        });
        this.creatures.forEach((creature) => {
            creature.tick(this);
        });
        this.projectiles.forEach((projectile) => {
            projectile.tick(this);
        });
        this.vehicles.forEach((vehicle) => {
            vehicle.tick(this);
        });
        this.emit('tick')
    }

    spawn(multiplier:number = 1){
        let spawnCreatures:any[] = [];
        let spawnResources:any[] = [];
        this.regions.forEach((region:Region) => {
            let size:number = Math.sqrt(region.getSize());
            region.spawns.forEach((spawn:SpawnMap) => {
                if(Math.random() < spawn.chance){
                    let count = randomInt(Math.round(spawn.min * size), Math.round(spawn.max * size)) * multiplier;
                    let spawnLimit = Math.round(spawn.limit * size)
                    count = Math.min(count, spawnLimit)
                    let isCreature = Object.values(CreatureType).includes(spawn.target as CreatureType);
                    let curCount = (
                        isCreature ?
                        region.countSourceInRegion(this.creatures, spawn.target):
                        region.countSourceInRegion(this.resources, spawn.target)
                    )
                    if(spawnLimit > 0){
                        count = Math.min(count, spawnLimit - curCount)
                    }
                    if(count <= 0) return;
                    for(let i = 0; i < count; i++){
                        let [x, y] = region.getRandomPoint().map(v => Math.round(v));
                        if(isCreature){
                            const creature:Creature = createCreature(spawn.target as CreatureType, x, y, randomInt(1, this.maxWildLevel), 0)
                            this.addCreature(creature);
                            spawnCreatures.push(creature.getSaveFormat());
                        } else {
                            const resource:Resource = createResource(spawn.target as ResourceType, x, y)
                            this.addResource(resource);
                            spawnResources.push(resource.getSaveFormat());
                        }
                    }
                }
            });
        });
        // this.emit('spawn', spawnResources, spawnCreatures);
    }

    addCreature(creature:Creature){
        creature.on('death', () => {
            this.removeCreature(creature);
        })
        this.creatures.push(creature);
        this.emit('creatureSpawn', creature)
    }

    removeCreature(creature:Creature){
        this.creatures.splice(this.creatures.indexOf(creature), 1);
        this.emit('creatureDeath', creature)
    }

    addResource(resource:Resource){
        resource.on('destroy', () => {
            this.removeResource(resource);
        })
        this.resources.push(resource);
        this.emit('resourceSpawn', resource)
    }

    removeResource(resource:Resource){
        this.resources.splice(this.resources.indexOf(resource), 1);
        this.emit('resourceDestroy', resource)
    }

    on(event:string, callback:(...args: any[]) => void){
        this.events.on(event, callback);
    }

    emit(event:string, ...args: any[]){
        this.events.emit(event, ...args);
    }

    getWorldData(){
        return {
            time: this.time,
            weather: this.weather,
        }
    }

    getWorldObjects(){
        return {
            resources: this.resources,
            creatures: this.creatures,
            projectiles: this.projectiles,
            vehicles: this.vehicles,
            structures: this.structures,
            regions: this.regions
        }
    }

    getWorldSaveFormat(){
        return {
            time: this.time,
            weather: this.weather,
            resources: this.resources.map((resource) => resource.getSaveFormat()),
            creatures: this.creatures.map((creature) => creature.getSaveFormat()),
            projectiles: this.projectiles.map((projectile) => projectile.getSaveFormat()),
            vehicles: this.vehicles.map((vehicle) => vehicle.getSaveFormat()),
            structures: this.structures.map((structure) => structure.getSaveFormat()),
            regions: this.regions.map((region) => region.getSaveFormat()),
        }
    }

    getWorldObjectsByChunk(x:number, y:number){
        return {
            resources: this.resources.filter((resource) => isInChunk(x, y, resource.x, resource.y, 32, 1)).map((resource) => resource.getSaveFormat()),
            creatures: this.creatures.filter((creature) => isInChunk(x, y, creature.x, creature.y, 32, 1)).map((creature) => creature.getSaveFormat()),
            projectiles: this.projectiles.filter((projectile) => isInChunk(x, y, projectile.x, projectile.y, 32, 1)).map((projectile) => projectile.getSaveFormat()),
            vehicles: this.vehicles.filter((vehicle) => isInChunk(x, y, vehicle.x, vehicle.y, 32, 1)).map((vehicle) => vehicle.getSaveFormat()),
            structures: this.structures.filter((structure) => isInChunk(x, y, structure.x, structure.y, 32, 1)).map((structure) => structure.getSaveFormat()),
            regions: this.regions.map(v => v.getSaveFormat()),
        }
    }

    getSpawn(){
        const forests = this.regions.filter((region) => region.type === RegionType.Forest)
        const [x, y] = forests[Math.floor(Math.random() * forests.length)].getRandomPoint();
        return {x, y}
    }
}

export const createWorld = (width:number = 10000, height:number = 10000, seed:string = generateSeed()):World => {
    console.log('Creating World...');
    console.log('Seed : ' + seed)
    
    let resources:ResourceSaveFormat[] = [];
    let creatures:CreatureSaveFormat[] = [];
    let projectiles:ProjectileSaveFormat[] = [];
    let vehicles:VehicleSaveFormat[] = [];
    let structures:StructureSaveFormat[] = [];
    let regions:RegionSaveFormat[] = [];

    let sites:[Point, RegionType][] = [];

    const config = {
        centerForestCount: 45,
        centerForestRange: 0.1,
        centerLakeCount: 5,
        spaceCount: 60,
        spaceRange: 0.06,
        spaceRadius: 13,
        oceanCount: 20,
        oceanRadius: 160,
        oceanRange: [0.76, 0.8],
        oceanDeepCount:20,
        oceanDeepRadius: 140.7536,
        oceanDeepRange: [0.86, 0.9],
        hellCount: 200,
        hellRadius: 150,
        hellRange: [0.72, 0.9],
        hellLavaCount: 200,
        hellLavaRadius: 150,
        hellLavaRange: [0.75, 0.9],
        outerBiomeCount: 11,
        outerBiomeRadius: 6,
        outerBiomeRange: [0.45, 0.6],
        innerBiomeCount: 7,
        innerBiomeRadius: 6,
        innerBiomeRange: [0.22, 0.3],
    }
    const mc:number = Math.floor(Math.min(width, height) / 2);
    const center:[number, number] = [width / 2, height / 2];
    let curSeed = seed;

    makeArcSites(curSeed, 0, config.centerForestRange*mc, 0, 360, config.centerForestCount, false, 2, ...center).forEach((pos) => {sites.push([pos, RegionType.Forest])})
    curSeed += config.centerForestCount.toString();
    let cla = seededRandomInt(curSeed, 0, 360)
    let clp = getPosByRot(...center, (0.01 * config.centerLakeCount) * mc, cla + 180)
    makeLineSites(curSeed, 0.005*mc, 0.01*mc, cla, 20, config.centerLakeCount, ...clp).forEach((pos) => {sites.push([pos, RegionType.Forest_Lake])})
    curSeed += config.centerLakeCount.toString();
    cla = seededRandomInt(curSeed, cla-100, cla+100)
    clp = getPosByRot(...center, (0.01 * config.centerLakeCount) * mc, cla + 180)
    makeLineSites(curSeed, 0.01*mc, 0.02*mc, cla, 20, config.centerLakeCount, ...clp).forEach((pos) => {sites.push([pos, RegionType.Forest_Lake])})
    curSeed += config.centerLakeCount.toString();
    const sr = (config.spaceRadius/2)
    for(let i = 0; i < config.spaceCount; i++){
        const angle = 360/config.spaceCount * i;
        makeArcSites(curSeed, (1-config.spaceRange)*mc, 1*mc, angle-sr, angle+sr, 1, false, 1, ...center).forEach((pos) => {sites.push([pos, RegionType.Space])})
        curSeed += 's'
    }

    const endAngle = seededRandomInt(curSeed, 0, 360);
    curSeed += config.spaceCount.toString();

    const or = (config.oceanRadius/2)
    const odr = (config.oceanDeepRadius/2)
    // ocean
    makeArcSites(curSeed, config.oceanDeepRange[0]*mc, config.oceanDeepRange[1]*mc, endAngle-odr, endAngle+odr, config.oceanDeepCount, true, 2, ...center).forEach((pos) => {
        sites.push([pos, RegionType.Ocean_Deep])
    });
    curSeed += config.oceanDeepCount.toString();
    makeArcSites(curSeed, config.oceanRange[0]*mc, config.oceanRange[1]*mc, endAngle-or, endAngle+or, config.oceanCount, true, 2, ...center).forEach((pos) => {
        sites.push([pos, RegionType.Ocean])
    });
    curSeed += config.oceanCount.toString();

    const hr = (config.hellRadius/2)
    const hlr = (config.hellLavaRadius/2)
    // hell
    makeArcSites(curSeed, config.hellRange[0]*mc, config.hellRange[1]*mc, endAngle+180-hr, endAngle+180+hr, config.hellCount, true, 2, ...center).forEach((pos) => {
        sites.push([pos, RegionType.Hell])
    })
    curSeed += config.hellCount.toString();
    makeArcSites(curSeed, config.hellLavaRange[0]*mc, config.hellLavaRange[1]*mc, endAngle+180-hlr, endAngle+180+hlr, config.hellLavaCount, true, 2, ...center).forEach((pos) => {
        sites.push([pos, RegionType.Hell_Lava])
    })
    curSeed += config.hellLavaCount.toString();

    // outer 바이옴 생성
    makeArcSites(curSeed, config.outerBiomeRange[0]*mc, config.outerBiomeRange[1]*mc, 0, 360, 10, true, 6, ...center).forEach((pos, i) => {
        if(i % 3 == 0){
            makeArcSites(curSeed, 0.1*mc, 0.12*mc, 0, 360, 11, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Jungle])})
            curSeed += 'oB0'
            makeArcSites(curSeed, 0, 0.04*mc, 0, 360, 3, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Jungle_Deep])})
            curSeed += 'oB1'
            makeArcSites(curSeed, 0.025*mc, 0.045*mc, 0, 360, 4, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Jungle])})
            curSeed += 'oB2'
            makeArcSites(curSeed, 0.08*mc, 0.1*mc, 0, 360, 7, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Jungle_Deep])})
            curSeed += 'oB3'
            makeArcSites(curSeed, 0.06*mc, 0.08*mc, 0, 360, 5, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Jungle_River])})
            curSeed += 'oB4'
        } else if(i % 3 == 1){
            makeArcSites(curSeed, 0.11*mc, 0.12*mc, 0, 360, 10, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Swamp])})
            curSeed += 'oB5'
            makeArcSites(curSeed, 0.02*mc, 0.1*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Swamp_Water])})
            curSeed += 'oB6'
            makeArcSites(curSeed, 0.08*mc, 0.1*mc, 0, 360, 8, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Swamp_Mud])})
            curSeed += 'oB7'
        } else if(i % 3 == 2){
            makeArcSites(curSeed, 0.1*mc, 0.11*mc, 0, 360, 5, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Forest])})
            curSeed += 'oB8'
            makeArcSites(curSeed, 0.04*mc, 0.08*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Forest_Deep])})
            curSeed += 'oB9'
            makeArcSites(curSeed, 0.02*mc, 0.06*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Forest_Lake])})
            curSeed += 'oB10'
        }
    })

    // inner 바이옴 생성
    makeArcSites(curSeed, config.innerBiomeRange[0]*mc, config.innerBiomeRange[1]*mc, 0, 360, 7, true, 6, ...center).forEach((pos, i) => {
        if(i % 4 == 0){
            makeArcSites(curSeed, 0.07*mc, 0.09*mc, 0, 360, 10, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Cave])})
            curSeed += 'iB0'
            makeArcSites(curSeed, 0*mc, 0.04*mc, 0, 360, 3, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Cave_Deep])})
            curSeed += 'iB1'
            makeArcSites(curSeed, 0.04*mc, 0.06*mc, 0, 360, 3, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Cave_Dark])})
            curSeed += 'iB2'
        } else if(i % 4 == 1){
            makeArcSites(curSeed, 0.06*mc, 0.08*mc, 0, 360, 6, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Snow])})
            curSeed += 'iB3'
            makeArcSites(curSeed, 0.04*mc, 0.08*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Snow_Ice])})
            curSeed += 'iB4'
            makeArcSites(curSeed, 0.02*mc, 0.04*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Snow_Lake])})
            curSeed += 'iB5'
        } else if(i % 4 == 2 || i % 4 == 3){
            makeArcSites(curSeed, 0.06*mc, 0.1*mc, 0, 360, 6, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Desert])})
            curSeed += 'iB6'
            makeArcSites(curSeed, 0.04*mc, 0.1*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Desert_Sandstone])})
            curSeed += 'iB7'
            makeArcSites(curSeed, 0, 0.024*mc, 0, 360, 2, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([pos, RegionType.Desert_Oasis])})
            curSeed += 'iB8'
        }
    })

    let diagram = voronoi().extent([[0,0],[width, height]])(sites.map((site) => [site[0][0], site[0][1]]));
    diagram.polygons().forEach((polygon:Polygon, i:number) => {
        regions.push({type:sites[i][1], polygon:polygon.map((point:Point) => [Math.round(point[0]), Math.round(point[1])])});
    });

    return new World(
        resources,
        creatures,
        projectiles,
        vehicles,
        structures,
        regions,
        0,
        0
    );
}
