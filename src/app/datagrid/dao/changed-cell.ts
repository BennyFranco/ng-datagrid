export class ChangedCell {
    id: string;
    row: number;
    column: number;
    oldValue: any;
    newValue: any;

    constructor(id: string, oldValue: any, newValue: any) {
        this.id = id;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.setRowAndColumn(id);
    }

    private setRowAndColumn(id: string) {
        const splittedString = id.split('-');
        const row = Number.parseInt(splittedString[0]);
        const col = Number.parseInt(splittedString[1]);

        this.row = row;
        this.column = col;
    }
}
