import { EventEmitter, Injectable, NgZone, Output } from '@angular/core';
import { isFirefox } from './shared/navigator-utils';
import { UndoManagerService } from './services/undo-manager/undo-manager.service';
import { FormatterService } from './services/formatter/formatter.service';
import { BufferedObject } from './services/undo-manager/buffered-object';
import { ChangedCell } from './dao/changed-cell';

@Injectable()
export class DatagridService {

  private _gridData: Array<any>;
  private _keysOfSchema: Array<any>;

  selectedElement: any;
  selectedElementId: string;
  cellWidth: number;

  private fixedTop = 'fixed-top';
  private fixedLeft = 'fixed-left';
  private fixedRowHeader = 'fixed-row-header';

  @Output() onCellChange = new EventEmitter();
  @Output() gridDataChange = new EventEmitter();

  set gridData(gridData: any) {
    this._gridData = gridData;
  }

  get gridData(): any {
    return this._gridData;
  }

  set keysOfSchema(keys: any) {
    this._keysOfSchema = keys;
  }

  get keysOfSchema(): any {
    return this._keysOfSchema;
  }

  constructor(
    private undoManegerService: UndoManagerService,
    private formatter: FormatterService,
    private zone: NgZone) {
    this.formatter.undoManager = this.undoManegerService;
  }

  selectElement(nativeElement: any, id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.classList.add('selected');
      this.selectedElement = element;
      this.selectedElementId = id;
    } else if (nativeElement) {
      nativeElement.classList.add('selected');
      this.selectedElement = nativeElement;
      this.selectedElementId = nativeElement.id;
    }
  }

  removeSelection(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.classList.remove('selected');
      if (element.children.length > 1) {
        this.cancelCellEdition(element, true, false);
      }
    }
  }

  changeCellValue(row: number, col: number, value: any) {
    const id = row + '-' + col;
    const element = document.getElementById(id);

    const waitingForDomUpdate = new Promise(resolve => {
      resolve(this.gridData[row][col] = value);
    });

    element.firstElementChild.textContent = value;

    waitingForDomUpdate.then(() => document.getElementById(id).className = element.className);
  }

  changeCellValueById(id: string, value: any) {
    const element = document.getElementById(id);
    const row = Number.parseInt(id.split('-')[0]);
    const col = Number.parseInt(id.split('-')[1]);
    const waitingForDomUpdate = new Promise(resolve => {
      resolve(this.gridData[row][col] = value);
    });

    element.firstElementChild.textContent = value;

    waitingForDomUpdate.then(() => document.getElementById(id).className = element.className);
  }

  disableCellById(id: string) {
    if (id) {
      const element = document.getElementById(id);
      element.classList.add('disable');
    }
  }

  disableCellByRowAndCol(row: number, col: number) {
    const id = row + '-' + col;
    this.disableCellById(id);
  }

  disableRow(row: number) {
    for (let i = 0; i < this.gridData[row].length; i++) {
      const id = row + '-' + i;
      this.disableCellById(id);
    }
  }

  disableColumn(column: number) {
    for (let row = 0; row < this.gridData.length; row++) {
      const id = row + '-' + column;
      this.disableCellById(id);
    }
  }

  addCellCustomClass(row: number, column: number, className: string) {
    const id = row + '-' + column;
    const element = document.getElementById(id);
    element.classList.add(className);
  }

  addCellCustomStyle(row: number, column: number, style: any) {
    const id = row + '-' + column;
    const domElement = document.getElementById(id);
    for (const key in style) {
      if (style.hasOwnProperty(key)) {
        const value = style[key];
        domElement.style.setProperty(key, value);
      }
    }
  }

  cancelCellEdition(element, saveElement: boolean, editable?: boolean) {
    if (element.children.length > 1) {
      if (saveElement) {
        this.undoManegerService.addToBuffer(new BufferedObject(element.id, element.children[0].textContent, element.children[1].value));
        const cell = new ChangedCell(element.id, element.children[0].textContent, element.children[1].value);
        element.firstElementChild.textContent = cell.newValue;
        this.emitChanges(cell);
      }
      element.removeChild(element.children[1]);
      element.children[0].style.display = 'block';
    } else if (editable) {
      this.addInput(element);
    }
  }

  addInput(element: any, replaceContent?: boolean, keyChar?: string) {
    if (element.classList.contains('disable')) {
      return;
    }
    if (element.children[1]) {
      return;
    }

    const input = document.createElement('input');
    input.type = 'text';

    if (!replaceContent) {
      input.value = element.children[0] ? element.children[0].textContent : '';
    }

    input.style.width = 'calc(' + element.children[0].offsetWidth + 'px - 0.25em)';
    input.style.height = 'calc(' + element.children[0].offsetHeight + 'px - 0.25em)';

    element.children[0].style.display = 'none';

    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.background = element.style.background;
    input.style.color = element.style.color;
    input.style.font = '12px sans-serif';
    input.style.margin = '0';
    input.style.padding = '0';

    input.classList.add('editing-input');
    element.appendChild(input);
    input.focus();

    if (keyChar && isFirefox()) {
      input.value = keyChar;
    }
  }

  editOnHitKey(element, replaceContent: boolean, keyChar?: string, event?) {
    this.addInput(element, replaceContent, keyChar);
  }

  emitChanges(cell: ChangedCell) {
    this.gridData[cell.row][cell.column] = cell.newValue;
    this.onCellChange.emit(cell);
    this.gridDataChange.emit(this.gridData);
  }

  generateEmptySheet(): Array<any> {
    return [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];
  }

  generateEmptySheetWithNumberOfRows(rows: number): Array<any> {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix.push([null, null, null, null, null, null, null, null]);
    }
    return matrix;
  }

  generateEmptySheetWithNumberOfRowsAndColumns(rows: number, columns: number): Array<any> {
    const matrix = [];
    let array = [];

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < columns; j++) {
        array.push(null);
      }
      matrix.push(array);
      array = [];
    }
    return matrix;
  }

  generateZeroSheet(): Array<any> {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }

  generateZeroSheetWithNumberOfRows(rows: number): Array<any> {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    return matrix;
  }

  /*************FORMATTERS*****************/

  readProperties(properties: any) {
    if (properties) {
      for (const key in properties) {
        if (properties.hasOwnProperty(key)) {
          const value = properties[key];

          switch (key) {
            case 'digits':
              this.formatter.digits = value;
              break;
            case 'currencyCode':
              this.formatter.currencyCode = value;
              break;
            case 'symbolDisplay':
              this.formatter.symbolDisplay = value;
              break;
            case 'digitInfo':
              this.formatter.digitInfo = value;
              break;
          }
        }
      }
    }
  }

  formatCellById(id: string, formatter: FormatterType, errorClass?: string, properties?: any) {
    setTimeout(() => {
      this.readProperties(properties);

      switch (formatter) {
        case FormatterType.Number:
          this.formatter.decimalFormat(id, errorClass);
          break;
        case FormatterType.Currency:
          this.formatter.currencyFormat(id, errorClass);
          break;
      }
    });
  }

  formatColumn(column: number, formatter: FormatterType, errorClass?: string, properties?: any) {
    setTimeout(() => {
      this.readProperties(properties);

      switch (formatter) {
        case FormatterType.Number:
          for (let row = 0; row < this.gridData.length; row++) {
            const id = row + '-' + column;
            this.formatter.decimalFormat(id, errorClass);
          }
          break;
      }
    });
  }

  formatRangeOfCells(from: string, to: string, formatter: FormatterType, errorClass?: string, properties?: any) {
    const fromArray = from.split('-');
    const toArray = to.split('-');

    for (let i = Number.parseInt(fromArray[0]); i <= Number.parseInt(toArray[0]); i++) {
      for (let j = Number.parseInt(fromArray[1]); j <= Number.parseInt(toArray[1]); j++) {
        this.formatCellById((i + '-' + j), formatter, errorClass, properties);
      }
    }
  }

  fixElements() {
    const table = document.querySelector('table');
    const fixedRowHeaders = [].concat.apply([], document.getElementsByClassName(this.fixedRowHeader));

    let leftHeaders = [].concat.apply([], document.getElementsByClassName(this.fixedLeft));
    let topHeaders = [].concat.apply([], document.getElementsByClassName(this.fixedTop));

    const doubleFixed = leftHeaders.filter(header => (header.classList.contains(this.fixedTop)));

    leftHeaders = leftHeaders.filter(header => !(header.classList.contains(this.fixedTop)));
    topHeaders = topHeaders.filter(header => !(header.classList.contains(this.fixedLeft)));
    console.log(topHeaders);

    const topLeft = document.getElementById('blank-cell');
    const computed = window.getComputedStyle(topHeaders[0]);

    table.appendChild(topLeft);

    table.removeEventListener('scroll');

    this.zone.runOutsideAngular(() => {
      table.addEventListener('scroll', () => {
        const x = table.scrollLeft;
        const y = table.scrollTop;

        leftHeaders.forEach((leftHeader) => {
          leftHeader.style.transform = this.translate(x, 0);
        });

        topHeaders.forEach((topHeader, i) => {
          if (i === 0) {
            topHeader.style.transform = this.translate(x, y);
          } else {
            topHeader.style.transform = this.translate(0, y);
          }
        });

        topLeft.style.transform = this.translate(x, y);

        if (doubleFixed) {
          doubleFixed.forEach((cell, i) => {
              cell.style.transform = this.translate(x, y);
          });
        }
      });
    });
  }

  translate(x, y): string {
    return 'translate(' + x + 'px, ' + y + 'px)';
  }

  fixFirstRow() {
    let id: string;
    ([...this.gridData].pop()).forEach((element, col) => {
      id = 0 + '-' + col;
      const domElement = document.getElementById('row-' + 0);
      domElement.classList.remove(this.fixedLeft);
      domElement.classList.add(this.fixedRowHeader);
      document.getElementById(id).classList.add(this.fixedTop);
    });
    this.fixElements();
  }

  fixFirstColumn() {
    let id: string;
    for (let row = 0; row < this._gridData.length; row++) {
      id = row + '-' + 0;
      const domElement = document.getElementById('col-' + 0);
      domElement.classList.add(this.fixedLeft);
      document.getElementById(id).classList.add(this.fixedLeft);
      domElement.style.width = document.getElementById(id).offsetWidth - 13 + 'px';
    }
    this.fixElements();
  }

  private fixRow(row: number) {
    let id: string;
    ([...this.gridData].pop()).forEach((element, col) => {
      id = row + '-' + col;
      const domElement = document.getElementById('row-' + row);
      domElement.classList.remove(this.fixedLeft);
      domElement.classList.add(this.fixedRowHeader);
      document.getElementById(id).classList.add(this.fixedTop);
    });
    this.fixElements();
  }

  fixRows(from: number, to: number) {
    let id: string;
    for (; from <= to; from++) {
      ([...this.gridData].pop()).forEach((element, col) => {

        id = from + '-' + col;
        const domElement = document.getElementById('row-' + from);
        domElement.classList.remove(this.fixedLeft);
        domElement.classList.add(this.fixedRowHeader);
        document.getElementById(id).classList.add(this.fixedTop);
      });
    }
    this.fixElements();
  }

  private fixColumn(col: number) {
    let id: string;
    for (let row = 0; row < this._gridData.length; row++) {
      id = row + '-' + col;
      const domElement = document.getElementById('col-' + col);
      domElement.classList.remove(this.fixedTop);
      domElement.classList.add(this.fixedRowHeader);
      document.getElementById(id).classList.add(this.fixedLeft);
    }
    this.fixElements();
  }

  fixColumns(from: number, to: number) {
    let id: string;
    for (; from <= to; from++) {
      const domElement = document.getElementById('col-' + from);
      domElement.classList.add(this.fixedLeft);
      for (let row = 0; row < this._gridData.length; row++) {
        id = row + '-' + from;
        document.getElementById(id).classList.add(this.fixedLeft);
      }
      domElement.style.width = document.getElementById(id).offsetWidth - 13 + 'px';
    }
    this.fixElements();
  }

  getArrayOfSchemas(): any {
    const schema = [];
    for (let row = 0; row < this.gridData.length; row++) {
      let stringObject = '';
      for (let col = 0; col < this.gridData[row].length; col++) {
        stringObject += '"' + this.keysOfSchema[col] + '":"' + this.gridData[row][col] + '",';
      }
      stringObject = stringObject.slice(0, -1);
      stringObject = '{' + stringObject + '}';
      const object = JSON.parse(stringObject);
      schema.push(object);
    }
    return schema;
  }
}

export enum FormatterType {
  Number,
  Currency,
  Text
}
