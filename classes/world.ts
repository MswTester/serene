import { EventEmitter } from "events";
import Resource from "./resource";
import Creature from "./creature";
import Projectile from "./projectile";
import Vehicle from "./vehicle";
import Structure from "./structure";
import Region from "./region";

export default class World{

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