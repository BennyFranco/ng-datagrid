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
      document.addEventListener('click', (event) => {
        let element;
        this.datagridService.removeSelection(this.datagridService.selectedElementId);
        if (event.toElement.tagName === 'SPAN') {
          element = event.toElement.parentElement;
        } else {
          element = event.toElement;
        }
        this.datagridService.selectElement(null, element.id);
      });
    });
  }

  onDoubleClick() {
    this.zone.runOutsideAngular(() => {
      document.addEventListener('dblclick', (event) => {
        let element;
        if (event.toElement.tagName === 'SPAN') {
          element = event.toElement.parentElement;
        } else {
          element = event.toElement;
        }
        this.datagridService.addInput(element);
      });
    });
  }

  /* @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
     this.datagridService.selectedElement.textContent = event.clipboardData.getData('text');
     this.zone.run(() => {
       this.datagridService
         .changeCellValueById(this.datagridService.selectedElementId, event.clipboardData.getData('text'));
     });
 
   }*/
}
