import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';
import { DatagridService } from '../datagrid.service';

@Directive({
  selector: '[ngEditable]',
})
export class EditableDirective implements AfterViewInit {

  constructor(
    private _elementRef: ElementRef,
    private datagridService: DatagridService) { }

  ngAfterViewInit() {
    if (this._elementRef.nativeElement.id === '0-0') {
      this.datagridService.selectElement(null, '0-0');
    }
  }

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
