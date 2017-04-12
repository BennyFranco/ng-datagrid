import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[ngKeyboardNavigation]'
})
export class KeyboardNavigationDirective {

  constructor() { }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    // console.log(event);

    switch (event.key) {
      case 'ArrowLeft': break;
      case 'ArrowRight':
        const element = document.getElementsByClassName('selected');
        let elementId: string = element.item(0).id;
        this.removeSelection(elementId);
        const col = Number.parseInt(elementId.split('-')[1]) + 1;
        elementId = elementId.split('-')[0] + '-' + col;
        this.selectElement(elementId);

        break;
      case 'ArrowUp': break;
      case 'ArrowDown': break;
    }
  }

  private selectElement(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.className = 'selected';
      element.style.border = '2px solid blue';
    }
  }

  private removeSelection(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.className = '';
      element.style.border = '1px solid #ddd';
    }
  }
}
