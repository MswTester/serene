import Recipe from '../recipe';
import Structure, { StructureType } from '../structure';
import Inventory from '../systems/inventory';

export default class Craftable extends Structure {
    readonly containedRecipes: Recipe[];

    inventory: Inventory;

    constructor(type: StructureType, name: string, maxHealth: number, hardness: number, defense: number, src: string, offsetWidth: number, offsetHeight: number, isCollidable: boolean,
        x: number, y: number, width: number, height: number, ownerId: string, ownerGuildId: string, containedRecipes: Recipe[], maxInventorySize: number) {
        super(type, name, maxHealth, hardness, defense, src, offsetWidth, offsetHeight, isCollidable, x, y, width, height, ownerId, ownerGuildId);
        this.containedRecipes = containedRecipes;
        this.inventory = new Inventory(maxInventorySize);
    }
}