import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DatagridService } from '../datagrid.service';

@Directive({
  selector: '[ngEditable]',
})
export class EditableDirective {

  constructor(
    private _elementRef: ElementRef,
    private datagridService: DatagridService) { }

  @HostListener('click') onClick() {
    this.datagridService.removeSelection(this.datagridService.selectedElementId);
    this.datagridService.selectElement(this._elementRef.nativeElement);
  }

  @HostListener('dblclick') onDoubleClick() {
    this.datagridService.addInput(this._elementRef.nativeElement);
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    this.datagridService.selectedElement.textContent = event.clipboardData.getData('text');
  }
}
