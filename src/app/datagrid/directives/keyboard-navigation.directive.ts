import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[ngKeyboardNavigation]'
})
export class KeyboardNavigationDirective implements AfterViewInit {
  @Input() limits: Array<any>;

  rowLimit: number;
  colLimit: number;

  constructor() { }

  ngAfterViewInit() {
    this.createRowAndColLimits();
  }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {

    const element = document.getElementsByClassName('selected');
    let elementId: string = element.item(0).id;
    let row = Number.parseInt(elementId.split('-')[0]);
    let col = Number.parseInt(elementId.split('-')[1]);

    console.log(event);
    if (event.keyCode === KeyCodes.ArrowLeft) {
      col -= 1;

      if (col > -1) {
        this.removeSelection(elementId);
        elementId = elementId.split('-')[0] + '-' + col;
        this.selectElement(elementId);
      }
      event.preventDefault();
    } else if (event.keyCode === KeyCodes.ArrowRight) {
      col += 1;

      if (col < this.colLimit) {
        this.removeSelection(elementId);
        elementId = elementId.split('-')[0] + '-' + col;
        this.selectElement(elementId);
      }
      event.preventDefault();
    } else if (event.keyCode === KeyCodes.ArrowUp) {
      row -= 1;
      if (row > -1) {
        this.removeSelection(elementId);
        elementId = row + '-' + elementId.split('-')[1];
        this.selectElement(elementId);
      }
      event.preventDefault();
    } else if (event.keyCode === KeyCodes.ArrowDown) {
      row += 1;
      if (row < this.rowLimit) {
        this.removeSelection(elementId);
        elementId = row + '-' + elementId.split('-')[1];
        this.selectElement(elementId);
      }
      event.preventDefault();
    } else if (event.keyCode === KeyCodes.Escape) {
      this.cancelCellEdition(element.item(0), false);
    } else if (event.keyCode === KeyCodes.Enter) {
      this.cancelCellEdition(element.item(0), true, true);
    } else if (event.keyCode >= 48 && event.keyCode <= 111) {
      this.editOnHitKey(element.item(0), true);
    } else if (event.keyCode >= 186 && event.keyCode <= 222) {
      this.editOnHitKey(element.item(0), true);
    } else if (event.keyCode === KeyCodes.Backspace || event.keyCode === KeyCodes.Delete) {
      this.editOnHitKey(element.item(0), true);
    }
  }

  private selectElement(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.className = 'selected';
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

  private addInput(element, replaceContent?: boolean) {
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
  }

  private editOnHitKey(element, replaceContent: boolean) {
    this.addInput(element, replaceContent);
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
