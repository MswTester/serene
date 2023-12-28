import Projectile, { ProjectileType } from "../projectile";
import Arrow from "../projectiles/arrow";

export const createProjectile = (type:ProjectileType, x:number, y:number, dx:number, dy:number, rotation:number, ownerId?:string, damageMultiplier?:number, uuid?:string):Projectile => {
    switch(type){
        case ProjectileType.Arrow:
            return new Arrow(x, y, dx, dy, rotation, ownerId, damageMultiplier, uuid);
        default:
            throw new Error('Invalid projectile type.');
    }
}