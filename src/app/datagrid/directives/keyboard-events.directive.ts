import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DatagridService } from '../datagrid.service';
import { UndoManagerService } from '../services/undo-manager.service';
import { isFirefox } from '../shared/navigator-utils';

@Directive({
  selector: '[ngKeyboardEvents]'
})
export class KeyboardEventsDirective {

  @Input() rowLimit: number;
  @Input() colLimit: number;

  constructor(
    private datagridService: DatagridService,
    private undoManegerService: UndoManagerService) { }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    const element = <HTMLElement>this.datagridService.selectedElement;
    // tslint:disable-next-line:prefer-const
    let elementId: string = this.datagridService.selectedElementId;
    // tslint:disable-next-line:prefer-const
    let row = Number.parseInt(elementId.split('-')[0]);
    // tslint:disable-next-line:prefer-const
    let col = Number.parseInt(elementId.split('-')[1]);

    if (event.keyCode === KeyCodes.ArrowLeft) {
      this.moveToLeft(col, elementId);
    } else if (event.keyCode === KeyCodes.ArrowRight) {
      this.moveToRight(col, elementId);
    } else if (event.keyCode === KeyCodes.ArrowUp) {
      this.moveToUp(row, elementId);
    } else if (event.keyCode === KeyCodes.ArrowDown) {
      this.moveToDown(row, elementId);
    }
  }

  @HostListener('document:keyup', ['$event'])
  keyUp(event: KeyboardEvent) {
    const element = <HTMLElement>this.datagridService.selectedElement;
    // tslint:disable-next-line:prefer-const
    let elementId: string = this.datagridService.selectedElementId;
    // tslint:disable-next-line:prefer-const
    let row = Number.parseInt(elementId.split('-')[0]);
    // tslint:disable-next-line:prefer-const
    let col = Number.parseInt(elementId.split('-')[1]);

    if (event.ctrlKey && event.which == 90) {
      this.undoManegerService.undo();
    } else if (event.ctrlKey && event.which == 89) {
      this.undoManegerService.redo();
    } else if (event.ctrlKey && event.which == 67) {
      const cellContent = element.textContent.trim();
      this.copyToClipboard(cellContent);
      return false;
    } else if (event.which === KeyCodes.Escape) {
      this.datagridService.cancelCellEdition(element, false);
    } else if (event.which === KeyCodes.Enter) {
      this.datagridService.cancelCellEdition(element, true, false);
      this.moveToDown(row, elementId);
    } else if (event.which === KeyCodes.Backspace || event.which === KeyCodes.Delete) {
      this.datagridService.editOnHitKey(element, true);
    }

  }

  @HostListener('document:keypress', ['$event'])
  keyPress(event: KeyboardEvent) {
    const element = <HTMLElement>this.datagridService.selectedElement;
    // tslint:disable-next-line:prefer-const
    let elementId: string = this.datagridService.selectedElementId;
    // tslint:disable-next-line:prefer-const
    let row = Number.parseInt(elementId.split('-')[0]);
    // tslint:disable-next-line:prefer-const
    let col = Number.parseInt(elementId.split('-')[1]);

    if (event.which >= 39 && event.which <= 191 && !event.ctrlKey) {
      this.datagridService.editOnHitKey(element, true, event.key);
    }
  }

  private moveToUp(row: number, elementId: string) {
    row -= 1;
    if (row > -1) {
      this.datagridService.removeSelection(elementId);
      elementId = row + '-' + elementId.split('-')[1];
      this.datagridService.selectElement(elementId);
    }
    event.preventDefault();
  }

  private moveToDown(row: number, elementId: string) {
    row += 1;
    if (row < this.rowLimit) {
      this.datagridService.removeSelection(elementId);
      elementId = row + '-' + elementId.split('-')[1];
      this.datagridService.selectElement(elementId);
    }
    event.preventDefault();
  }

  private moveToLeft(col: number, elementId: string) {
    col -= 1;

    if (col > -1) {
      this.datagridService.removeSelection(elementId);
      elementId = elementId.split('-')[0] + '-' + col;
      this.datagridService.selectElement(elementId);
    }
    event.preventDefault();
  }

  private moveToRight(col: number, elementId: string) {
    col += 1;

    if (col < this.colLimit) {
      this.datagridService.removeSelection(elementId);
      elementId = elementId.split('-')[0] + '-' + col;
      this.datagridService.selectElement(elementId);
    }
    event.preventDefault();
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
