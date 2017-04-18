import { Injectable, Output, EventEmitter } from '@angular/core';
import { isFirefox } from './shared/navigator-utils';
import { UndoManagerService } from './services/undo-manager/undo-manager.service';
import { BufferedObject } from './services/undo-manager/buffered-object';
import { ChangedCell } from './dao/changed-cell';

@Injectable()
export class DatagridService {

  selectedElement: any;
  selectedElementId: string;
  gridData: any;

  @Output() onCellChange = new EventEmitter();
  @Output() gridDataChange = new EventEmitter();

  constructor(private undoManegerService: UndoManagerService) { }

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
      this.cancelCellEdition(element, true);
    }
  }

  changeCellValue(row: number, col: number, value: any) {
    const id = row + '-' + col;
    const element = document.getElementById(id);
    element.firstElementChild.textContent = value;

    const waitingForDomUpdate = new Promise(resolve => {
      resolve((n) => {
        this.gridData[row][col] = value;
        return true;
      }
      );
    });

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
        this.emitChanges(cell);
        element.children[0].textContent = element.children[1].value;
      }
      element.removeChild(element.children[1]);
      element.children[0].style.display = 'inherit';
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
    element.children[0].style.display = 'none';
    input.style.border = 'none';
    input.style.outline = 'none';
    input.style.backgroundColor = element.style.backgroundColor;
    input.style.color = element.style.color;
    input.style.width = 'calc(60px - 0.25em)';
    input.style.height = 'calc(12px - 0.25em)';
    input.style.font = '12px sans-serif';
    input.style.margin = '0';
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
    this.onCellChange.emit(cell);
    this.gridData[cell.row][cell.column] = cell.newValue;
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
}
