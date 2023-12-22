import seedrandom from 'seedrandom'
import Region, { RegionType } from './region';
import Forest from './regions/forest';
import Forest_Deep from './regions/forest_deep';
import Forest_Lake from './regions/forest_lake';
import Ocean from './regions/ocean';
import Ocean_Deep from './regions/ocean_deep';
import Space from './regions/space';
import Desert from './regions/desert';
import Desert_Sandstone from './regions/desert_sandstone';
import Desert_Oasis from './regions/desert_oasis';
import Snow from './regions/snow';
import Snow_Ice from './regions/snow_ice';
import Snow_Lake from './regions/snow_lake';
import Jungle from './regions/jungle';
import Jungle_Deep from './regions/jungle_deep';
import Jungle_River from './regions/jungle_river';
import Swamp from './regions/swamp';
import Swamp_Mud from './regions/swamp_mud';
import Swamp_Water from './regions/swamp_water';
import Cave from './regions/cave';
import Cave_Deep from './regions/cave_deep';
import Cave_Dark from './regions/cave_dark';
import Hell from './regions/hell';
import Hell_Lava from './regions/hell_lava';
import Creature, { CreatureType } from './creature';
import Resource, { ResourceType } from './resource';

/** UUID 생성 */
export const generateUUID = () => {
    let uuid = '';
    for(let i = 0; i < 32; i++){
        uuid += Math.floor(Math.random() * 16).toString(16);
    }
    return uuid;
}

/** 랜덤 시드 생성 */
export const generateSeed = (length:number = 16) => {
    let seed = '';
    for(let i = 0; i < length; i++){
        seed += Math.floor(Math.random() * 16).toString(16);
    }
    return seed;
}

/** 시드 기반 랜덤 정수 생성 */
export const seededRandomInt = (seed:string, min:number, max:number) => {
    const rand = seedrandom(seed);  // seedrandom 라이브러리를 사용합니다.
    return Math.floor(rand.quick() * (max - min + 1)) + min;
}

/** 시드 기반 랜덤 실수 생성 */
export const seededRandomFloat = (seed:string, min:number, max:number) => {
    const rand = seedrandom(seed);  // seedrandom 라이브러리를 사용합니다.
    return rand.quick() * (max - min) + min;
}

/** 다각형 내부의 랜덤한 점을 생성 */
export const getRandomPositionInPolygon = (polygon: [number, number][]): [number, number] => {
    // 다각형의 centroid를 구합니다.
    const centroid = getPolygonCentroid(polygon);
  
    // 다각형의 각 점과 centroid 사이의 최대 거리를 구합니다.
    let maxDistance = Math.max(...polygon.map(p => Math.hypot(p[0] - centroid[0], p[1] - centroid[1])));
    let avgDistance = maxDistance / polygon.length;
  
    // 랜덤한 방향과 거리를 선택합니다.
    let angle = Math.random() * Math.PI * 2;
    let distance = Math.random() * avgDistance;
  
    // 새로운 점을 생성합니다.
    let x = centroid[0] + distance * Math.cos(angle);
    let y = centroid[1] + distance * Math.sin(angle);
  
    return [x, y];
}

/** 다각형의 넓이를 구합니다. */
export const getPolygonArea = (points: [number, number][]): number => {
    let area = 0;

    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i][0] * points[j][1];
        area -= points[j][0] * points[i][1];
    }

    return Math.abs(area / 2);
}

/** 다각형의 centroid를 구합니다. */
export const getPolygonCentroid = (polygon: [number, number][]): [number, number] => {
    let xSum = 0, ySum = 0;
  
    for (const [x, y] of polygon) {
      xSum += x;
      ySum += y;
    }
  
    return [xSum / polygon.length, ySum / polygon.length];
}

/** 각도와 거리에 따른 점의 상대좌표를 구합니다. */
export const getPosByRot = (x:number, y:number, distance:number, angle:number):[number, number] => {
    const rad = angle * Math.PI / 180;
    return [x + distance * Math.cos(rad), y + distance * Math.sin(rad)]
}

/** 시드 기반 사이트 생성 */
export const makeSite = (seed:string, minDistance:number, maxDistance:number, minAngle:number, maxAngle:number, repeat:number, golgoru:boolean, grange:number, cx:number, cy:number):[number, number][] =>{
    let poses:[number, number][] = []
    for(let i = 0; i < repeat; i++){
        let angle = seededRandomInt(seed, minAngle, maxAngle);
        if(golgoru){
            let gap = (maxAngle - minAngle) / repeat
            angle = minAngle + gap * i + seededRandomInt(seed, -gap / grange, gap / grange);
        }
        const distance = seededRandomInt(seed, minDistance, maxDistance);
        const [x, y] = getPosByRot(cx, cy, distance, angle);
        poses.push([x, y]);
    }
    return shuffle(poses);
}

/** 배열을 suffle */
export const shuffle = (array:any[]) => {
    let currentIndex = array.length,  randomIndex;
  
    while (currentIndex != 0) {
  
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
  
    return array;
}

/** RegionType에 따라 Region을 생성합니다. */
export const createRegion = (type:RegionType, polygon:[number, number][]):Region => {
    switch(type){
        case RegionType.Forest:
            return new Forest(polygon);
        case RegionType.Forest_Deep:
            return new Forest_Deep(polygon);
        case RegionType.Forest_Lake:
            return new Forest_Lake(polygon);
        case RegionType.Ocean:
            return new Ocean(polygon);
        case RegionType.Ocean_Deep:
            return new Ocean_Deep(polygon);
        case RegionType.Desert:
            return new Desert(polygon);
        case RegionType.Desert_Sandstone:
            return new Desert_Sandstone(polygon);
        case RegionType.Desert_Oasis:
            return new Desert_Oasis(polygon);
        case RegionType.Snow:
            return new Snow(polygon);
        case RegionType.Snow_Ice:
            return new Snow_Ice(polygon);
        case RegionType.Snow_Lake:
            return new Snow_Lake(polygon);
        case RegionType.Jungle:
            return new Jungle(polygon);
        case RegionType.Jungle_Deep:
            return new Jungle_Deep(polygon);
        case RegionType.Jungle_River:
            return new Jungle_River(polygon);
        case RegionType.Swamp:
            return new Swamp(polygon);
        case RegionType.Swamp_Mud:
            return new Swamp_Mud(polygon);
        case RegionType.Swamp_Water:
            return new Swamp_Water(polygon);
        case RegionType.Cave:
            return new Cave(polygon);
        case RegionType.Cave_Deep:
            return new Cave_Deep(polygon);
        case RegionType.Cave_Dark:
            return new Cave_Dark(polygon)
        case RegionType.Hell:
            return new Hell(polygon);
        case RegionType.Hell_Lava:
            return new Hell_Lava(polygon);
        case RegionType.Space:
            return new Space(polygon);
        default:
            return null;
    }
}

/** CreatureType에 따라 Creature 생성 */
export const createCreature = (type:CreatureType, x:number, y:number):Creature => {
    switch(type){
        // case CreatureType:
        default:
            return null;
    }
}

/** ResourceType에 따라 Resource 생성 */
export const createResource = (type:ResourceType, x:number, y:number):Resource => {
    switch(type){
        // case ResourceType:
        default:
            return null;
    }
}