import { polygonCentroid } from 'd3';
import seedrandom from 'seedrandom'

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
    const centroid = polygonCentroid(polygon);
  
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
function getPolygonArea(points: [number, number][]): number {
    let area = 0;

    for (let i = 0; i < points.length; i++) {
        const j = (i + 1) % points.length;
        area += points[i][0] * points[j][1];
        area -= points[j][0] * points[i][1];
    }

    return Math.abs(area / 2);
}