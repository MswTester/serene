import Creature, { CreatureType } from "../../creature";
import { ItemSaveFormat } from "../../item";
import Inventory from "../../systems/inventory";

export default class Player extends Creature {
    static defaultType:CreatureType = CreatureType.Player;
    static defaultName:string = 'Player';
    static defaultSrc:string = 'creatures/others/player';
    static defaultOffsetWidth:number = 1;
    static defaultOffsetHeight:number = 1;
    static defaultStateTypes:string[] = ['idle', 'walk', 'run', 'attack', 'dead'];
    static defaultBaseHealth:number = 100;
    static defaultBaseDamage:number[] = [5];
    static defaultBaseDefense:number = 0;
    static defaultBaseFood:number = 100;
    static defaultBaseSpeed:number[] = [1];
    static defaultDrops:ItemDrop[] = [];
    static defaultWidth:number = 1;
    static defaultHeight:number = 1.5;

    readonly guildId:string;

    constructor(x:number, y:number, lvl:number, exp:number, uuid?:string, dx?:number, dy?:number, direction?:Direction, state?:string, health?:number, food?:number, inventory?:(ItemSaveFormat|null)[], guildId?:string) {
        super(
            Player.defaultType,
            Player.defaultName,
            Player.defaultSrc,
            Player.defaultOffsetWidth,
            Player.defaultOffsetHeight,
            Player.defaultStateTypes,
            Player.defaultBaseHealth,
            Player.defaultBaseDamage,
            Player.defaultBaseDefense,
            Player.defaultBaseFood,
            Player.defaultBaseSpeed,
            Player.defaultDrops,
            Player.defaultWidth,
            Player.defaultHeight,
            lvl, exp,
            x, y, dx, dy, direction,
            uuid, state, health, food,
            inventory != undefined ? Inventory.toInventory(inventory) : new Inventory(40),
            false, '', ''
        );
        this.guildId = guildId || '';
    }

    getSaveFormat() {
        return {
            type: this.type,
            uuid: this.uuid,
            x: this.x,
            y: this.y,
            dx: this.dx,
            dy: this.dy,
            direction: this.direction,
            level: this.level,
            exp: this.exp,
            state: this.state,
            health: this.health,
            food: this.food,
            isTamed: false,
            inventory: this.inventory.getSaveFormat(),
            ownerId: '',
            ownerGuildId: '',
            guildId: this.guildId
        }
    }
}