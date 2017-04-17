import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';
import { DatagridService } from '../datagrid.service';
import { isFirefox } from '../shared/navigator-utils';

@Directive({
  selector: '[ngKeyboardEvents]'
})
export class KeyboardEventsDirective implements AfterViewInit {
  @Input() limits: Array<any>;

  rowLimit: number;
  colLimit: number;

  constructor(private datagridService: DatagridService) { }

  ngAfterViewInit() {
    this.createRowAndColLimits();
  }

  @HostListener('document:keydown', ['$event'])
  keyDown(event: KeyboardEvent) {
    // console.log(event);

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
    // console.log(event);

    const element = <HTMLElement>this.datagridService.selectedElement;
    // tslint:disable-next-line:prefer-const
    let elementId: string = this.datagridService.selectedElementId;
    // tslint:disable-next-line:prefer-const
    let row = Number.parseInt(elementId.split('-')[0]);
    // tslint:disable-next-line:prefer-const
    let col = Number.parseInt(elementId.split('-')[1]);

    if (event.ctrlKey && event.which == 90) {
      alert('Keyboard shortcut working!');
      return false;
    } else if (event.ctrlKey && event.which == 67) {
      const cellContent = element.textContent.trim();
      this.copyToClipboard(cellContent);
      return false;
    } else if (event.which === KeyCodes.Escape) {
      this.cancelCellEdition(element, false);
    } else if (event.which === KeyCodes.Enter) {
      this.cancelCellEdition(element, true, false);
      this.moveToDown(row, elementId);
    } else if (event.which === KeyCodes.Backspace || event.which === KeyCodes.Delete) {
      this.editOnHitKey(element, true);
    }

  }

  @HostListener('document:keypress', ['$event'])
  keyPress(event: KeyboardEvent) {
    console.log(event);

    const element = <HTMLElement>this.datagridService.selectedElement;
    // tslint:disable-next-line:prefer-const
    let elementId: string = this.datagridService.selectedElementId;
    // tslint:disable-next-line:prefer-const
    let row = Number.parseInt(elementId.split('-')[0]);
    // tslint:disable-next-line:prefer-const
    let col = Number.parseInt(elementId.split('-')[1]);

    if (event.which >= 39 && event.which <= 191 && !event.ctrlKey) {
      this.editOnHitKey(element, true, event.key);
    }
  }

  private selectElement(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.className = 'selected';
      this.datagridService.selectedElement = element;
      this.datagridService.selectedElementId = element.id;
    }
  }

  private removeSelection(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.className = '';
      this.cancelCellEdition(element, true);
    }
  }

  private createRowAndColLimits() {
    this.rowLimit = this.limits.length;
    if (this.limits.length > 0) {
      this.colLimit = this.limits[0].length;
    }
  }

  private cancelCellEdition(element, saveElement: boolean, editable?: boolean) {
    if (element.children.length > 1) {
      if (saveElement) {
        element.children[0].textContent = element.children[1].value;
      }
      element.removeChild(element.children[1]);
      element.children[0].style.display = 'inherit';
    } else if (editable) {
      this.addInput(element);
    }
  }

  private addInput(element, replaceContent?: boolean, keyChar?: string) {
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

  private editOnHitKey(element, replaceContent: boolean, keyChar?: string, event?) {
    this.addInput(element, replaceContent, keyChar);
  }

  private moveToUp(row: number, elementId: string) {
    row -= 1;
    if (row > -1) {
      this.removeSelection(elementId);
      elementId = row + '-' + elementId.split('-')[1];
      this.selectElement(elementId);
    }
    event.preventDefault();
  }

  private moveToDown(row: number, elementId: string) {
    row += 1;
    if (row < this.rowLimit) {
      this.removeSelection(elementId);
      elementId = row + '-' + elementId.split('-')[1];
      this.selectElement(elementId);
    }
    event.preventDefault();
  }

  private moveToLeft(col: number, elementId: string) {
    col -= 1;

    if (col > -1) {
      this.removeSelection(elementId);
      elementId = elementId.split('-')[0] + '-' + col;
      this.selectElement(elementId);
    }
    event.preventDefault();
  }

  private moveToRight(col: number, elementId: string) {
    col += 1;

    if (col < this.colLimit) {
      this.removeSelection(elementId);
      elementId = elementId.split('-')[0] + '-' + col;
      this.selectElement(elementId);
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
