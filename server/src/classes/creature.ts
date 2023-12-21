import { EventEmitter } from "events";
import { Direction, ItemDrop } from "./types";
import { generateUUID } from "./utils";

export default class Creature {
    readonly type: CreatureType;
    readonly name: string;

    readonly src: string;
    readonly offsetWidth: number;
    readonly offsetHeight: number;

    readonly baseHealth: number;
    readonly baseDamage: number;
    readonly baseDefense: number;
    readonly baseOxygen: number;
    readonly baseFood: number;
    readonly baseSpeed: number;

    readonly drops: ItemDrop[];

    uuid: string;
    events: EventEmitter;

    level: number;
    exp: number;

    health: number;
    damage: number;
    defense: number;
    oxygen: number;
    food: number;
    speed: number;

    x: number;
    y: number;
    dx: number;
    dy: number;
    direction: Direction;
    width: number;
    height: number;

    isTamed: boolean;
    ownerId: string;
    ownerGuildId: string;

    constructor(type: CreatureType, name: string, src: string, offsetWidth: number, offsetHeight: number,
        baseHealth: number, baseDamage: number, baseDefense: number, baseOxygen: number, baseFood: number, baseSpeed: number, drops: ItemDrop[],
        x: number, y: number, dx: number, dy: number, direction: Direction, width: number, height: number, level:number, exp:number, isTamed: boolean, ownerId: string, ownerGuildId: string) {
        this.type = type;
        this.name = name;
        this.src = src;
        this.offsetWidth = offsetWidth;
        this.offsetHeight = offsetHeight;
        this.baseHealth = baseHealth;
        this.baseDamage = baseDamage;
        this.baseDefense = baseDefense;
        this.baseOxygen = baseOxygen;
        this.baseFood = baseFood;
        this.baseSpeed = baseSpeed;
        this.drops = drops;

        this.uuid = generateUUID();
        this.events = new EventEmitter();
        this.level = level;
        this.exp = exp;
        this.health = this.baseHealth * (1+this.level/100);
        this.damage = this.baseDamage * (1+this.level/100);
        this.defense = this.baseDefense * (1+this.level/100);
        this.oxygen = this.baseOxygen * (1+this.level/100);
        this.food = this.baseFood * (1+this.level/100);
        this.speed = this.baseSpeed * (1+this.level/100);
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.direction = direction;
        this.width = width;
        this.height = height;
        this.isTamed = isTamed;
        this.ownerId = ownerId;
        this.ownerGuildId = ownerGuildId;
    }

    on(event: string, listener: (...args: any[]) => void) {
        this.events.on(event, listener);
    }

    emit(event: string, ...args: any[]) {
        this.events.emit(event, ...args);
    }
}

export enum CreatureType {
    // Passive
    Grimlin = 'grimlin',
    Fairy = 'fairy',
    Unicorn = 'unicorn',
    // Hostile
    Wyvern = 'wyvern',
    Drake = 'drake',
    Shadow_Beast = 'shadow_beast',
    // Boss
    Golem = 'golem',
    Titan = 'titan',
    Pheonix = 'pheonix',
    // Others
}