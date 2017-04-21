import { Directive, ElementRef, HostListener, Input, NgZone } from '@angular/core';
import { DatagridService } from '../datagrid.service';

@Directive({
  selector: '[ngEditable]',
})
export class EditableDirective {

  constructor(
    private _elementRef: ElementRef,
    private datagridService: DatagridService,
    private zone: NgZone) {
    this.subscribeEvents();
  }

  subscribeEvents() {
    this.onClick();
    this.onDoubleClick();
  }

  onClick() {
    this.zone.runOutsideAngular(() => {
      document.addEventListener('click', (event: MouseEvent) => {
        let element;
        this.datagridService.removeSelection(this.datagridService.selectedElementId);
        if ((<HTMLElement>event.target).tagName === 'SPAN') {
          element = (<HTMLElement>event.target).parentElement;
        } else {
          element = (<HTMLElement>event.target);
        }
        this.datagridService.selectElement(null, element.id);
      });
    });
  }

  onDoubleClick() {
    this.zone.runOutsideAngular(() => {
      document.addEventListener('dblclick', (event) => {
        let element;
        if ((<HTMLElement>event.target).tagName === 'SPAN') {
          element = (<HTMLElement>event.target).parentElement;
        } else {
          element = (<HTMLElement>event.target);
        }
        this.datagridService.addInput(element);
      });
    });
  }
}
