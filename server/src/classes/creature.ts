import { generateUUID, EventEmitter } from "./utils";
import Inventory from "./systems/inventory";
import World from "./world";
import { ItemSaveFormat } from "./item";

enum Direction{
    Up = 'up',
    Down = 'down',
    Left = 'left',
    Rigt = 'right',
}

export default class Creature {
    type: CreatureType;
    name: string;

    src: string;
    offsetWidth: number;
    offsetHeight: number;

    stateTypes: string[];

    baseHealth: number;
    baseDamage: number[];
    baseDefense: number;
    baseFood: number;
    baseSpeed: number[];

    drops: ItemDrop[];

    uuid: string;
    events: EventEmitter;

    level: number;
    exp: number;

    state: string;

    health: number;
    food: number;

    x: number;
    y: number;
    dx: number;
    dy: number;
    direction: Direction;
    width: number;
    height: number;

    inventory: Inventory;
    isTamed: boolean;
    ownerId: string;
    ownerGuildId: string;

    constructor(type: CreatureType, name: string, src: string, offsetWidth: number, offsetHeight: number,
        stateTypes:string[], baseHealth: number, baseDamage: number[], baseDefense: number, baseFood: number, baseSpeed: number[], drops: ItemDrop[],
        x: number, y: number, width: number, height: number, level:number, exp:number, dx?: number, dy?: number, direction?: Direction,
        uuid?:string, state?:string, health?:number, food?:number, inventory?:Inventory, isTamed?: boolean, ownerId?: string, ownerGuildId?: string) {
        this.type = type;
        this.name = name;
        this.src = src;
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        this.stateTypes = stateTypes;
        this.baseHealth = baseHealth;
        this.baseDamage = baseDamage;
        this.baseDefense = baseDefense;
        this.baseFood = baseFood;
        this.baseSpeed = baseSpeed;
        this.drops = drops;

        this.uuid = uuid || generateUUID();
        this.events = new EventEmitter();
        this.level = level;
        this.exp = exp;
        this.state = state || this.stateTypes[0];
        this.health = health != undefined ? health : this.baseHealth * (1+this.level/100);
        this.food = food != undefined ? food : this.baseFood * (1+this.level/100);
        this.x = x;
        this.y = y;
        this.dx = dx || 0;
        this.dy = dy || 0;
        this.direction = direction || Direction.Down;
        this.width = width;
        this.height = height;
        this.inventory = inventory || new Inventory(10);
        this.isTamed = isTamed != undefined ? isTamed : false;
        this.ownerId = ownerId != undefined ? ownerId : '';
        this.ownerGuildId = ownerGuildId != undefined ? ownerGuildId : '';
    }

    on(event: string, listener: (...args: any[]) => void) {
        this.events.on(event, listener);
    }

    emit(event: string, ...args: any[]) {
        this.events.emit(event, ...args);
    }

    getStat(){
        return {
            health: this.baseHealth * (1+this.level/100),
            damage: this.baseDamage.map(v => v * (1+this.level/100)),
            defense: this.baseDefense * (1+this.level/100),
            food: this.baseFood * (1+this.level/100),
            speed: this.baseSpeed.map(v => v * (1+this.level/100)),
        }
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
            isTamed: this.isTamed,
            inventory: this.inventory.getSaveFormat(),
            ownerId: this.ownerId,
            ownerGuildId: this.ownerGuildId,
        }
    }

    update(saveform:CreatureSaveFormat){
        this.type = saveform.type || this.type
        this.x = saveform.x == undefined ? this.x : saveform.x
        this.y = saveform.y == undefined ? this.y : saveform.y
        this.dx = saveform.dx == undefined ? this.dx : saveform.dx
        this.dy = saveform.dy == undefined ? this.dy : saveform.dy
        this.direction = saveform.direction || this.direction
        this.level = saveform.level == undefined ? this.level : saveform.level
        this.exp = saveform.exp == undefined ? this.exp : saveform.exp
        this.state = saveform.state || this.state
        this.health = saveform.health == undefined ? this.health : saveform.health
        this.food = saveform.food == undefined ? this.food : saveform.food
        this.isTamed = saveform.isTamed == undefined ? this.isTamed : saveform.isTamed
        this.inventory = Inventory.toInventory(saveform.inventory) || this.inventory
        this.ownerId = saveform.ownerId || this.ownerId
        this.ownerGuildId = saveform.ownerGuildId || this.ownerGuildId
    }

    tick(world: World) {
        // Do nothing
    }
}

export interface CreatureSaveFormat {
    type: CreatureType;
    uuid: string;
    x: number;
    y: number;
    dx: number;
    dy: number;
    direction: Direction;
    level: number;
    exp: number;
    state: string;
    health: number;
    food: number;
    isTamed: boolean;
    inventory: any[];
    ownerId: string;
    ownerGuildId: string;
    guildId?: string;
    name?: string;
}

export enum CreatureType {
    // Friendly
    Chilia = 'chilia', // (forest) Chinchilla, 털이 많은 생쥐, 테이밍 가능
    Silk_Bee = 'silk_bee', // (forest) Bee, 실크를 생산하는 벌, 테이밍 가능
    Flutterby = 'flutterby', // (forest_deep) Butterfly, 반투명한 날개를 가진 나비, 테이밍 가능
    Dewdeer = 'dewdeer', // (forest_lake) Deer, 물방울 모양의 뿔을 가진 사슴, 테이밍 가능
    Crystal_Gecko = 'crystal_gecko', // (cave_dark) Gecko, 보석을 먹는 빛나는 도마뱀, 테이밍 가능
    Savi = 'savi', // (desert) Sand cat, 사막에 사는 고양이, 테이밍 가능
    Camol = 'camol', // (desert_sandstone) Camel, 혹이 1개인 낙타, 테이밍 가능
    Forst_Hare = 'forst_hare', // (snow) Hare, 눈토끼, 테이밍 가능
    Moss_Frog = 'moss_frog', // (swamp) Frog, 이끼로 덮인 개구리, 테이밍 가능
    Bubble_Ray = 'bubble_ray', // (ocean) Manta ray, 거품을 뿜는 가오리, 테이밍 가능
    Star_Jelly = 'star_jelly', // (space) Jellyfish, 별처럼 빛나는 해파리, 테이밍 가능

    // Neutral
    Moon_Blossom = 'moon_blossom', // (forest) Moon blossom, 밤일때 반짝이는 기린느낌 생명체, 테이밍 가능
    Iron_Hawk = 'iron_hawk', // (forest_deep) Hawk, 철같은 날개를 가진 매, 테이밍 가능
    Lurker = 'lurker', // (cave) Lurker, 동굴에 사는 돌같이 생긴 거미, 테이밍 가능
    Glow_Cent = 'glow_cent', // (cave_deep) Centipede, 지네, 테이밍 가능
    Scorbian = 'scorbian', // (desert) Scorpion, 전갈, 테이밍 가능
    Griffin = 'griffin', // (desert_sandstone) Griffin, 사자와 독수리를 합친 형태의 생물, 테이밍 가능
    Frost_Owl = 'frost_owl', // (snow) Owl, 눈으로 뒤덥힌 올빼미, 테이밍 가능
    Polygon = 'polygon', // (snow_ice) Polar bear, 북극곰, 테이밍 가능
    Mudskipper = 'mudskipper', // (swamp_mud) Mudskipper, 육지와 물을 자유롭게 이동하는 물고기, 테이밍 가능
    Fernback_Rhino = 'fernback_rhino', // (jungle) Rhino, 뿔이 3개 연발로 있는 코뿔소, 테이밍 가능
    Karicat = 'karicat', // (jungle_deep) Jaguar, 표범, 테이밍 가능
    Abyssal_Shark = 'abyssal_shark', // (ocean_deep) Shark, 깊은 바다에 사는 상어, 테이밍 가능
    Magma_Tortoise = 'magma_tortoise', // (hell_lava) Tortoise, 용암을 먹는 거북이, 테이밍 가능
    Starlight = 'starlight', // (space) Starlight, 별처럼 빛나는 유령, 테이밍 불가능

    // Aggressive
    Feral_Fox = 'feral_fox', // (forest_deep) Fox, 광포한 여우, 테이밍 가능
    Drake = 'drake', // (cave_dark) Drake, 깃털 날개를 가진 드래곤, 테이밍 가능
    Dusk_Panther = 'dusk_panther', // (cave_dark) Dusk panther, 그림자 외형의 표범, 테이밍 가능
    Deathworm = 'deathworm', // (desert) Deathworm, 사막에 사는 거대한 벌레, 테이밍 가능
    Frost_Wolf = 'frost_wolf', // (snow) Wolf, 얼음 같은 털을 가진 늑대, 테이밍 가능
    Anaconda = 'anaconda', // (jungle) Anaconda, 거대한 뱀, 테이밍 가능
    Riverback_Croc = 'riverback_croc', // (jungle_water) Crocodile, 악어, 테이밍 가능
    Kraken = 'kraken', // (ocean_deep) Kraken, 거대한 문어, 테이밍 가능
    Flame_Hound = 'flame_hound', // (hell) Hellhound, 불을 뿜는 개, 테이밍 가능
    Wyvern = 'wyvern', // (hell_lava) Wyvern, 날개를 가진 드래곤, 테이밍 가능
    Void_Serpent = 'void_serpent', // (space) Void serpent, 우주에 사는 거대한 뱀, 테이밍 불가능

    // Boss
    Ent = 'ent', // (forest_deep) Boss, 사람형태를 가진 거대한 나무 괴물
    Golem = 'golem', // (cave_dark) Boss, 돌로 만들어진 거대한 괴물
    Basilisk = 'basilisk', // (desert) Boss, 거대한 모래 뱀
    Ice_Behemoth = 'ice_behemoth', // (snow_ice) Boss, 눈을 뿜는 거대한 코뿔소
    Hydra = 'hydra', // (swamp) Boss, 머리가 여러개인 거대한 드래곤형태의 뱀
    Jungle_Titan = 'jungle_titan', // (jungle_deep) Boss, 나무를 조종하는 거대한 생명체
    Leviathan = 'leviathan', // (ocean_deep) Boss, 용과 고래를 합친 형태의 거대한 괴물고기
    Pheonix = 'pheonix', // (hell) Boss, 불을 뿜는 새
    Guardian = 'guardian', // (space) Boss, 우주의 수호자
    
    // Fianl Boss
    Overload = 'overload', // (space) Final Boss, 인간 형태의 

    // Others
    Player = 'player',
    Item = 'item',
    Custom = 'custom',
}