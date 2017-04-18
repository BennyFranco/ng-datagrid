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
      element.className = 'selected';
      this.selectedElement = element;
      this.selectedElementId = id;
    } else if (nativeElement) {
      nativeElement.className = 'selected';
      this.selectedElement = nativeElement;
      this.selectedElementId = nativeElement.id;
    }
  }

  removeSelection(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.className = '';
      this.cancelCellEdition(element, true);
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

  addInput(element, replaceContent?: boolean, keyChar?: string) {
    if (element.children[1]) {
      return;
    }
    const input = document.createElement('input');
    input.type = 'text';
    if (!replaceContent) {
      input.value = element.children[0] ? element.children[0].textContent : '';
    }
    element.appendChild(input);
    element.children[0].style.display = 'none';
    input.style.border = 'none';
    input.style.width = '60px';
    input.style.height = '12px';
    input.style.font = '12px sans-serif';
    input.style.outline = 'none';
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
