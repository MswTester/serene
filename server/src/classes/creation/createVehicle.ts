import Vehicle, { VehicleType } from "../vehicle";
import Bike from "../vehicles/bikes/bike";

export const createVehicle = (type:VehicleType, x:number, y:number, ownerId?:string, ownerGuildId?:string, uuid?:string, health?:number, fuel?:number):Vehicle => {
    switch(type){
        case VehicleType.Bike:
            return new Bike(x, y, ownerId, ownerGuildId, uuid, health, fuel);
        default:
            throw new Error('Invalid Vehicle Type');
    }
}