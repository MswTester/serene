import { voronoi } from 'd3-voronoi'
import { EventEmitter } from "events";
import Resource, { ResourceType } from "./resource";
import Creature, { CreatureType } from "./creature";
import Projectile from "./projectile";
import Vehicle from "./vehicle";
import Structure from "./structure";
import Region, { RegionType } from "./region";
import { generateSeed, makeSite, randomFloat, randomInt, seededRandomInt } from "./utils";
import { createRegion } from './creation';

export default class World{

    // world constants
    spawnTick:number = 36000; // 10 minutes
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

    constructor(resourceData:Resource[], creatureData:Creature[], projectileData:Projectile[], vehicleData:Vehicle[], structureData:Structure[], regionData:Region[], time:number, weather:number){
        this.resources = resourceData;
        this.creatures = creatureData;
        this.projectiles = projectileData;
        this.vehicles = vehicleData;
        this.structures = structureData;
        this.regions = regionData;
        this.time = time;
        this.weather = weather;

        this.events = new EventEmitter();
    }

    init(){
        this.spawn();
    }

    tick(){
        this.time++;
        if(this.time % this.spawnTick == 0){
            this.spawn();
        }
    }

    spawn(){
        this.regions.forEach((region) => {
            region.spawns.forEach((spawn) => {
                if(Math.random() < spawn.chance){
                    let size = region.getSize();
                    let count = randomInt(spawn.min * size, spawn.max * size);
                    let spawnLimit = spawn.limit * size
                    if(spawnLimit > 0){
                        count = Math.min(count, spawnLimit - region.countSourceInRegion(this.creatures, spawn.target as CreatureType));
                    }
                    if(count <= 0) return;
                    for(let i = 0; i < count; i++){
                        let [x, y] = region.getRandomPoint();
                        if(Object.values(CreatureType).includes(spawn.target as CreatureType)){
                            // this.addCreature();
                        } else if(Object.values(ResourceType).includes(spawn.target as ResourceType)){
                            // this.addResource();
                        }
                    }
                }
            });
        });
    }

    addCreature(creature:Creature){
        creature.on('death', () => {
            this.removeCreature(creature);
        })
        this.creatures.push(creature);
    }

    removeCreature(creature:Creature){
        this.creatures.splice(this.creatures.indexOf(creature), 1);
    }

    addResource(resource:Resource){
        resource.on('destroy', () => {
            this.removeResource(resource);
        })
        this.resources.push(resource);
    }

    removeResource(resource:Resource){
        this.resources.splice(this.resources.indexOf(resource), 1);
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
            regions: this.regions,
        }
    }
}

export const createWorld = (width:number = 10000, height:number = 10000, seed:string = generateSeed()):World => {
    let resources:Resource[] = [];
    let creatures:Creature[] = [];
    let projectiles:Projectile[] = [];
    let vehicles:Vehicle[] = [];
    let structures:Structure[] = [];
    let regions:Region[] = [];

    let sites:[number, number, RegionType][] = [];

    const config = {
        centerForestRange: 100,
        spaceCount: 60,
        spaceRange: 0.06,
        spaceRadius: 10,
        oceanCount: 20,
        oceanRadius: 160,
        oceanRange: [0.76, 0.8],
        oceanDeepCount:20,
        oceanDeepRadius: 140,
        oceanDeepRange: [0.86, 0.9],
        hellCount: 25,
        hellRadius: 140,
        hellRange: [0.8, 0.9],
        hellLavaCount: 20,
        hellLavaRadius: 140,
        hellLavaRange: [0.8, 0.9],
        outerBiomeCount: 10,
        outerBiomeRadius: 6,
        outerBiomeRange: [0.44, 0.6],
        innerBiomeCount: 7,
        innerBiomeRadius: 6,
        innerBiomeRange: [0.2, 0.3],
    }
    const mc:number = Math.floor(Math.min(width, height) / 2);
    const center:[number, number] = [width / 2, height / 2];

    makeSite(seed, 0, config.centerForestRange, 0, 360, 1, false, 1, ...center).forEach((pos) => {sites.push([...pos, RegionType.Forest])})
    const sr = (config.spaceRadius/2)
    for(let i = 0; i < config.spaceCount; i++){
        const angle = 360/config.spaceCount * i;
        makeSite(seed, (1-config.spaceRange)*mc, 1*mc, angle-sr, angle+sr, 1, false, 1, ...center).forEach((pos) => {sites.push([...pos, RegionType.Space])})
    }

    const endAngle = seededRandomInt(seed, 0, 360);

    const or = (config.oceanRadius/2)
    const odr = (config.oceanDeepRadius/2)
    // ocean
    makeSite(seed, config.oceanDeepRange[0]*mc, config.oceanDeepRange[1]*mc, endAngle-odr, endAngle+odr, config.oceanDeepCount, true, 2, ...center).forEach((pos) => {
        sites.push([...pos, RegionType.Ocean_Deep])
    });
    makeSite(seed, config.oceanRange[0]*mc, config.oceanRange[1]*mc, endAngle-or, endAngle+or, config.oceanCount, true, 2, ...center).forEach((pos) => {
        sites.push([...pos, RegionType.Ocean])
    });

    const hr = (config.hellRadius/2)
    const hlr = (config.hellLavaRadius/2)
    // hell
    makeSite(seed, config.hellRange[0]*mc, config.hellRange[1]*mc, endAngle+180-hr, endAngle+180+hr, config.hellCount, true, 2, ...center).forEach((pos) => {
        sites.push([...pos, RegionType.Hell])
    })
    makeSite(seed, config.hellLavaRange[0]*mc, config.hellLavaRange[1]*mc, endAngle+180-hlr, endAngle+180+hlr, config.hellLavaCount, true, 2, ...center).forEach((pos) => {
        sites.push([...pos, RegionType.Hell_Lava])
    })
    
    // outer 바이옴 생성
    makeSite(seed, 2200, 3000, 0, 360, 10, true, 6, ...center).forEach((pos, i) => {
        if(i % 3 == 0){
            makeSite(seed, 0.1*mc, 0.12*mc, 0, 360, 10, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Jungle])})
            makeSite(seed, 0, 0.04*mc, 0, 360, 3, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Jungle_Deep])})
            makeSite(seed, 0.06*mc, 0.08*mc, 0, 360, 3, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Jungle_River])})
        } else if(i % 3 == 1){
            makeSite(seed, 0.11*mc, 0.12*mc, 0, 360, 10, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Swamp])})
            makeSite(seed, 0.02*mc, 0.1*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Swamp_Water])})
            makeSite(seed, 0.08*mc, 0.1*mc, 0, 360, 8, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Swamp_Mud])})
        } else if(i % 3 == 2){
            makeSite(seed, 0.1*mc, 0.11*mc, 0, 360, 5, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Forest])})
            makeSite(seed, 0.04*mc, 0.08*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Forest_Deep])})
            makeSite(seed, 0.02*mc, 0.06*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Forest_Lake])})
        }
    })

    // inner 바이옴 생성
    makeSite(seed, 1000, 1500, 0, 360, 7, true, 6, ...center).forEach((pos, i) => {
        if(i % 4 == 0){
            makeSite(seed, 0.07*mc, 0.09*mc, 0, 360, 10, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Cave])})
            makeSite(seed, 0*mc, 0.04*mc, 0, 360, 3, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Cave_Deep])})
            makeSite(seed, 0.04*mc, 0.06*mc, 0, 360, 3, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Cave_Dark])})
        } else if(i % 4 == 1){
            makeSite(seed, 0.06*mc, 0.08*mc, 0, 360, 6, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Snow])})
            makeSite(seed, 0.04*mc, 0.08*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Snow_Ice])})
            makeSite(seed, 0.02*mc, 0.04*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Snow_Lake])})
        } else if(i % 4 == 2 || i % 4 == 3){
            makeSite(seed, 0.06*mc, 0.1*mc, 0, 360, 6, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Desert])})
            makeSite(seed, 0.04*mc, 0.1*mc, 0, 360, 3, true, 3, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Desert_Sandstone])})
            makeSite(seed, 0, 0.024*mc, 0, 360, 2, true, 2, pos[0], pos[1]).forEach((pos) => {sites.push([...pos, RegionType.Desert_Oasis])})
        }
    })

    let diagram = voronoi().extent([[0,0],[width, height]])(sites.map((site) => [site[0], site[1]]));
    diagram.polygons().forEach((polygon, i) => {
        regions.push(createRegion(sites[i][2], polygon.map((point) => [point[0], point[1]])));
    });

    return new World(
        resources,
        creatures,
        projectiles,
        vehicles,
        structures,
        regions,
        0,
        0,
    );
}
