import Vehicle, { VehicleType } from "../../vehicle";

export default class Bike extends Vehicle {
    static defaultType = VehicleType.Bike;
    static defaultName = "Bike";
    static defaultMaxHealth = 100;
    static defaultMaxFuel = 1;
    static defaultDefense = 0;
    static defaultSrc = "vehicles/bikes/bike";
    static defaultOffsetWidth = 1;
    static defaultOffsetHeight = 1;
    static defaultIsCollidable = true;
    static defaultIsNeedFuel = true;
    static defaultWidth = 1.5;
    static defaultHeight = 1;

    constructor(x:number, y:number, ownerId?:string, ownerGuildId?:string, uuid?:string, health?:number, fuel?:number){
        super(Bike.defaultType,
            Bike.defaultName,
            Bike.defaultMaxHealth,
            Bike.defaultMaxFuel,
            Bike.defaultDefense,
            Bike.defaultSrc,
            Bike.defaultOffsetWidth,
            Bike.defaultOffsetHeight,
            Bike.defaultIsCollidable,
            Bike.defaultIsNeedFuel,
            x, y, 0, 0, Bike.defaultWidth, Bike.defaultHeight, Direction.Down, ownerId, ownerGuildId, uuid, health, fuel);
    }
}