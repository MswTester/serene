export default class Player {
    name: string;
    online: boolean = false;
    constructor(name: string) {
        this.name = name;
    }
}