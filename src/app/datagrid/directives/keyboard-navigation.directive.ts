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

    switch (event.key) {
      case 'ArrowLeft':
        col -= 1;

        if (col > -1) {
          this.removeSelection(elementId);
          elementId = elementId.split('-')[0] + '-' + col;
          this.selectElement(elementId);
        }
        break;
      case 'ArrowRight':
        col += 1;

        if (col < this.colLimit) {
          this.removeSelection(elementId);
          elementId = elementId.split('-')[0] + '-' + col;
          this.selectElement(elementId);
        }
        break;
      case 'ArrowUp':
        row -= 1;
        if (row > -1) {
          this.removeSelection(elementId);
          elementId = row + '-' + elementId.split('-')[1];
          this.selectElement(elementId);
        }
        break;
      case 'ArrowDown':
        row += 1;
        if (row < this.rowLimit) {
          this.removeSelection(elementId);
          elementId = row + '-' + elementId.split('-')[1];
          this.selectElement(elementId);
        }
        break;
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

  private cancelCellEdition(element, saveElement: boolean) {

    if (element.children.length > 1) {
      if (saveElement) {
        element.children[0].textContent = element.children[1].value;
      }
      element.removeChild(element.children[1]);
      element.children[0].style.display = 'inherit';
    }
  }
}
