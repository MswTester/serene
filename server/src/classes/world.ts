import { Voronoi, polygonCentroid, polygonContains } from "d3";
import { EventEmitter } from "events";
import Resource from "./resource";
import Creature from "./creature";
import Projectile from "./projectile";
import Vehicle from "./vehicle";
import Structure from "./structure";
import Region from "./region";
import { generateSeed } from "./utils";

export default class World{

    // world constants
    spawnTick:number = 18000; // 5 minutes
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
                    let x = Math.random() * 1000;
                    let y = Math.random() * 1000;
                    let target = new spawn.target(x, y);
                    if(target instanceof Creature){
                        this.addCreature(target);
                    } else if(target instanceof Resource){
                        this.addResource(target);
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
        resource.on('death', () => {
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