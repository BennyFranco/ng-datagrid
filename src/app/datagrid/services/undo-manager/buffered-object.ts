export class BufferedObject {
    id: string;
    oldValue: any;
    newValue: any;

    constructor(id: string, oldValue: any, newValue: any) {
        this.id = id;
        this.oldValue = oldValue;
        this.newValue = newValue;
    }
}
