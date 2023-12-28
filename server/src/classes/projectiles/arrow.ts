import Projectile, { ProjectileType } from "../projectile";

export default class Arrow extends Projectile{
    static defaultType = ProjectileType.Arrow;
    static defaultMaxDistance = 100;
    static defaultDamage = 10;
    static defaultSrc = 'projectiles/arrow';
    static defaultOffsetWidth = 1;
    static defaultOffsetHeight = 1;
    static defaultWidth = 1;
    static defaultHeight = 1;

    constructor(x:number, y:number, dx:number, dy:number, rotation:number, ownerId?:string, damageMultiplier?:number, uuid?:string){
        super(
            Arrow.defaultType,
            Arrow.defaultMaxDistance,
            Arrow.defaultDamage,
            Arrow.defaultSrc,
            Arrow.defaultOffsetWidth,
            Arrow.defaultOffsetHeight,
            x, y, dx, dy, rotation, Arrow.defaultWidth, Arrow.defaultHeight, ownerId, damageMultiplier, uuid
        );
    }
}