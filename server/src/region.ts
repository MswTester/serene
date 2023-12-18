import { Entity } from "./entities";
import ServerLogic from "./logic";
import { Resource } from "./resources";

export interface spawnData{
    target:Entity|Resource; // 스폰 대상
    amount:number; // 한번에 스폰할 양
    maxInterval:number; // 최대 스폰 간격 (ms)
    interval:number; // 스폰 간격 (ms)
    maxSpawn:number; // 최대 스폰 수
    chance:number; // 스폰 확률 (0~1)
    radius:number; // 스폰 반경
    currentSpawn:number; // 현재 스폰 수
}

export class Region{
    // pinned values
    readonly tag: string = 'region';
    readonly x: number = 0;
    readonly y: number = 0;
    readonly width: number = 50;
    readonly height: number = 50;
    // dynamic values
    spawn: spawnData[] = [];
    constructor(tag:string, x:number, y:number, size:[number, number], spawn:spawnData[] = []){
        this.tag = tag;
        this.x = x;
        this.y = y;
        this.width = size[0];
        this.height = size[1];
        this.spawn = spawn;
    }

    toJsonObject(){
        return {
            tag: this.tag,
            x: this.getPosition().x,
            y: this.getPosition().y,
            width: this.getScale().x,
            height: this.getScale().y,
            spawn: this.spawn.map(spawn => {return{
                target: spawn.target.toJsonObject(),
                amount: spawn.amount,
                maxInterval: spawn.maxInterval,
                interval: spawn.interval,
                maxSpawn: spawn.maxSpawn,
                chance: spawn.chance,
                radius: spawn.radius,
                currentSpawn: spawn.currentSpawn
            }})
        };
    }

    getPosition(){return {x:this.x, y:this.y};}
    getScale(){return {x:this.width, y:this.height};}

    tick(delta:number, world:ServerLogic){
        this.spawn.forEach(spawn => {
            spawn.interval -= delta;
            if(spawn.interval < 0){
                spawn.interval = Math.floor(Math.random() * spawn.maxInterval);
                if(Math.random() < spawn.chance){
                    let amount = spawn.amount;
                    for(let i = 0; i < amount; i++){
                        let x = this.x + Math.floor(Math.random() * this.width);
                        let y = this.y + Math.floor(Math.random() * this.height);
                        let target = spawn.target;
                        if(target instanceof Entity){
                            let entity = spawn.target as Entity;
                            entity.setPosition(x, y);
                            world.addEntity(entity);
                            entity.events.on('destroy', () => {
                                spawn.currentSpawn--;
                            })
                        } else if(target instanceof Resource){
                            let resource = spawn.target as Resource;
                            resource.setPosition(x, y);
                            world.addResource(resource);
                            resource.events.on('destroy', () => {
                                spawn.currentSpawn--;
                            })
                        }
                        spawn.currentSpawn++;
                    }
                }
            }
        });
    }
}