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

/** 랜덤 정수 생성 */
export const randomInt = (min:number, max:number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** 랜덤 실수 생성 */
export const randomFloat = (min:number, max:number) => {
    return Math.random() * (max - min) + min;
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

/** 다각형 내부에 점이 있는지 확인 */
export const isInsidePolygon = (point: Point, polygon: Polygon): boolean => {
    let [x, y] = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let [xi, yi] = polygon[i];
        let [xj, yj] = polygon[j];

        let intersect = ((yi > y) != (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
}

/** 다각형 내부의 랜덤한 점을 생성 */
export const getRandomPositionInPolygon = (polygon: Polygon): Point => {
    let minX = Math.min(...polygon.map(p => p[0]));
    let maxX = Math.max(...polygon.map(p => p[0]));
    let minY = Math.min(...polygon.map(p => p[1]));
    let maxY = Math.max(...polygon.map(p => p[1]));

    let point: Point;
    do {
        let x = Math.random() * (maxX - minX) + minX;
        let y = Math.random() * (maxY - minY) + minY;
        point = [x, y];
    } while (!isInsidePolygon(point, polygon));

    return point;
}

/** 다각형의 넓이를 구합니다. */
export const getPolygonArea = (polygon: Polygon): number => {
    let area = 0;

    for (let i = 0; i < polygon.length; i++) {
        const j = (i + 1) % polygon.length;
        area += polygon[i][0] * polygon[j][1] - polygon[j][0] * polygon[i][1];
    }

    return Math.abs(area / 2);
}

/** 다각형의 centroid를 구합니다. */
export const getPolygonCentroid = (polygon: Polygon): Point => {
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
export const makeArcSites = (seed:string, minDistance:number, maxDistance:number, minAngle:number, maxAngle:number, repeat:number, golgoru:boolean, grange:number, cx:number, cy:number):Point[] =>{
    let poses:[number, number][] = []
    for(let i = 0; i < repeat; i++){
        let angle = seededRandomInt(seed + `${i}`, minAngle, maxAngle);
        if(golgoru){
            let gap = (maxAngle - minAngle) / repeat
            angle = minAngle + gap * i + seededRandomInt(seed + `${i}`, -gap / grange, gap / grange);
        }
        const distance = seededRandomInt(seed + `${i}` + 'd', minDistance, maxDistance);
        if(maxDistance == 555) console.log(angle, distance)
        const [x, y] = getPosByRot(cx, cy, distance, angle);
        poses.push([x, y]);
    }
    return shuffle(poses);
}

/** 시드 기반 사이트 생성 */
export const makeLineSites = (seed:string, minDistance:number, maxDistance:number, angle:number, radius:number, repeat:number, cx:number, cy:number, poses:Point[] = []):Point[] =>{
    if(repeat == 0) return poses;

    let lastPos = poses[poses.length - 1] || [cx, cy];
    let arcAngle = seededRandomInt(seed + `${repeat}`, angle - radius, angle + radius);
    makeArcSites(seed + `${repeat}`, minDistance, maxDistance, arcAngle, arcAngle, 1, false, 1, ...lastPos).forEach(([x, y]) => {
        poses.push([x, y]);
    })
    return makeLineSites(seed + `${repeat}`, minDistance, maxDistance, arcAngle, radius, repeat - 1, cx, cy, poses);
}

/** 시드 기반 사이트 생성 */
// export const makeRootSites = (seed:string, minDistance:number, maxDistance:number, angle:number, radius:number) => {

// }

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

/** 직사각형을 다각형으로 변환 */
export const rectToPolygon = (x:number, y:number, width:number, height:number):[number, number][] => {
    return [
        [x, y],
        [x + width, y],
        [x + width, y + height],
        [x, y + height]
    ]
}

/** 다각형과 다각형의 충돌 */
export function isIntersecting(polygon: Polygon, polygon2: Polygon): boolean {

    // 선분 교차 판별 함수
    function checkIntersection(p1: Point, p2: Point, q1: Point, q2: Point): boolean {
        function cross(p: Point, q: Point): number {
            return p[0] * q[1] - p[1] * q[0];
        }

        function subtract(p: Point, q: Point): Point {
            return [p[0] - q[0], p[1] - q[1]];
        }

        const r = subtract(p2, p1);
        const s = subtract(q2, q1);
        const uNumerator = cross(subtract(q1, p1), r);
        const denominator = cross(r, s);

        if (denominator == 0) {
            return false; // 선분이 평행하거나 겹치는 경우
        }

        const u = uNumerator / denominator;
        const t = cross(subtract(q1, p1), s) / denominator;

        return (t >= 0) && (t <= 1) && (u >= 0) && (u <= 1);
    }

    // 다각형의 모든 선분과 직사각형의 모든 선분이 교차하는지 확인
    for (let i = 0; i < polygon.length; i++) {
        let j = (i + 1) % polygon.length;
        for (let k = 0; k < polygon2.length; k++) {
            let l = (k + 1) % polygon2.length;
            if (checkIntersection(polygon[i], polygon[j], polygon2[k], polygon2[l])) {
                return true;
            }
        }
    }

    return false;
}
