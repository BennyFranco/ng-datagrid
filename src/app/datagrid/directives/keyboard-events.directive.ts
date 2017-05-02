import { AfterViewInit, Directive, HostListener, Input, NgZone, OnDestroy } from '@angular/core';
import { DatagridService } from '../datagrid.service';
import { UndoManagerService } from '../services/undo-manager/undo-manager.service';
import { isFirefox } from '../shared/navigator-utils';
import { ChangedCell } from '../dao/changed-cell';

@Directive({
  selector: '[ngKeyboardEvents]'
})
export class KeyboardEventsDirective implements AfterViewInit, OnDestroy {

  @Input() rowLimit: number;
  @Input() colLimit: number;

  element: HTMLElement;
  elementId: string;
  row: number;
  col: number;

  constructor(
    private datagridService: DatagridService,
    private undoManegerService: UndoManagerService,
    private zone: NgZone) {
  }

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      this.subscribeKeyboardEvents();
    });
  }

  ngOnDestroy() {
    this.unsubscribeEvents();
  }

  subscribeKeyPressEvent() {
    document.addEventListener('keypress', (event: KeyboardEvent) => {
      if (event.which >= 39 && event.which <= 242 && !event.ctrlKey) {
        this.getDomElement();
        this.datagridService.editOnHitKey(this.element, true, event.key);
      }
    });
  }

  subscribeKeyUpEvent() {
    document.addEventListener('keyup', (event: KeyboardEvent) => {
      if (event.ctrlKey && event.which === 90) {
        this.undoManegerService.undo();
        const position = this.undoManegerService.stackPos;
        const cell = new ChangedCell(this.undoManegerService.stack[position + 1].id,
          this.undoManegerService.stack[position + 1].newValue,
          this.undoManegerService.stack[position + 1].oldValue);
        this.datagridService.emitChanges(cell);
      } else if (event.ctrlKey && event.which === 89) {
        this.undoManegerService.redo();
        const position = this.undoManegerService.stackPos;
        const cell = new ChangedCell(this.undoManegerService.stack[position].id,
          this.undoManegerService.stack[position].oldValue,
          this.undoManegerService.stack[position].newValue);
        this.datagridService.emitChanges(cell);
      } else if (event.ctrlKey && event.which === 67) {
        this.getDomElement();
        const cellContent = this.element.textContent.trim();
        this.copyToClipboard(cellContent);
        return false;
      } else if (event.which === KeyCodes.Escape) {
        this.getDomElement();
        this.datagridService.cancelCellEdition(this.element, false);
      } else if (event.which === KeyCodes.Enter) {
        this.getDomElement();
        this.datagridService.cancelCellEdition(this.element, true, false);
        this.moveToDown(this.row, this.elementId);
        event.preventDefault();
      } else if (event.which === KeyCodes.Backspace || event.which === KeyCodes.Delete) {
        this.getDomElement();
        this.datagridService.editOnHitKey(this.element, true);
      }
    });
  }

  subscribeKeyDownEvent() {
    document.addEventListener('keydown', (event: KeyboardEvent) => {
      if (event.which === KeyCodes.ArrowLeft) {
        this.getDomElement();
        this.moveToLeft(this.col, this.elementId);
        event.preventDefault();
      } else if (event.which === KeyCodes.ArrowRight) {
        this.getDomElement();
        this.moveToRight(this.col, this.elementId);
        event.preventDefault();
      } else if (event.which === KeyCodes.ArrowUp) {
        this.getDomElement();
        this.moveToUp(this.row, this.elementId);
        event.preventDefault();
      } else if (event.which === KeyCodes.ArrowDown) {
        this.getDomElement();
        this.moveToDown(this.row, this.elementId);
        event.preventDefault();
      } else if (!event.shiftKey && event.which === 9) {
        this.getDomElement();
        this.moveToRight(this.col, this.elementId);
        event.preventDefault();
      } else if (event.shiftKey && event.which === 9) {
        this.getDomElement();
        this.moveToLeft(this.col, this.elementId);
        event.preventDefault();
      }
    });
  }

  unsubscribeEvent(event: string) {
    document.removeEventListener(event.toString());
  }

  unsubscribeEvents() {
    ['keydown', 'keypress', 'keyup'].forEach(event => this.unsubscribeEvent(event));
  }

  subscribeKeyboardEvents() {
    this.subscribeKeyDownEvent();
    this.subscribeKeyUpEvent();
    this.subscribeKeyPressEvent();
  }

  private getDomElement() {
    this.element = <HTMLElement>this.datagridService.selectedElement;
    this.elementId = this.datagridService.selectedElementId;
    this.row = Number.parseInt(this.elementId.split('-')[0]);
    this.col = Number.parseInt(this.elementId.split('-')[1]);
  }

  private moveToUp(row: number, elementId: string) {
    row -= 1;
    if (row > -1) {
      this.datagridService.removeSelection(elementId);
      elementId = row + '-' + elementId.split('-')[1];
      this.datagridService.selectElement(null, elementId);
    }
  }

  private moveToDown(row: number, elementId: string) {
    row += 1;
    if (row < this.rowLimit) {
      this.datagridService.removeSelection(elementId);
      elementId = row + '-' + elementId.split('-')[1];
      this.datagridService.selectElement(null, elementId);
    }
  }

  private moveToLeft(col: number, elementId: string) {
    col -= 1;

    if (col > -1) {
      this.datagridService.removeSelection(elementId);
      elementId = elementId.split('-')[0] + '-' + col;
      this.datagridService.selectElement(null, elementId);
    }
  }

  private moveToRight(col: number, elementId: string) {
    col += 1;

    if (col < this.colLimit) {
      this.datagridService.removeSelection(elementId);
      elementId = elementId.split('-')[0] + '-' + col;
      this.datagridService.selectElement(null, elementId);
    }
  }

  private copyToClipboard(value: string) {
    const textarea = document.createElement('textarea');
    textarea.style.height = '0px';
    textarea.style.left = '-100px';
    textarea.style.opacity = '0';
    textarea.style.position = 'fixed';
    textarea.style.top = '-100px';
    textarea.style.width = '0px';
    document.body.appendChild(textarea);

    textarea.value = value;
    textarea.select();

    document.execCommand('copy');

    if (textarea && textarea.parentNode) {
      textarea.parentNode.removeChild(textarea);
    }
  }
}

export enum KeyCodes {
  Backspace = 8,
  Enter = 13,
  Escape = 27,
  ArrowLeft = 37,
  ArrowUp = 38,
  ArrowRight = 39,
  ArrowDown = 40,
  Delete = 46,
}
