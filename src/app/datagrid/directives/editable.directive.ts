import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';
import { UndoManagerService } from '../services/undo-manager.service';
import { DatagridService } from '../datagrid.service';

@Directive({
  selector: '[ngEditable]',
})
export class EditableDirective implements AfterViewInit {

  constructor(
    private _elementRef: ElementRef,
    private datagridService: DatagridService,
    private undoManegerService: UndoManagerService) { }

  ngAfterViewInit() {
    if (this._elementRef.nativeElement.id === '0-0') {
      this.selectElement();
    }
  }

  @HostListener('click') onClick() {
    this.removeSelection(this.datagridService.selectedElementId);
    this.selectElement();
  }

  @HostListener('dblclick') onDoubleClick() {
    this.addInput();
  }

  @HostListener('paste', ['$event']) onPaste(event: ClipboardEvent) {
    this.datagridService.selectedElement.textContent = event.clipboardData.getData('text');
  }

  private addInput() {
    if (this._elementRef.nativeElement.children[1]) {
      return;
    }
    const input = document.createElement('input');
    input.type = 'text';
    input.value = this._elementRef.nativeElement.children[0] ? this._elementRef.nativeElement.children[0].textContent : '';
    this._elementRef.nativeElement.appendChild(input);
    this._elementRef.nativeElement.children[0].style.display = 'none';
    input.style.border = 'none';
    input.style.width = '60px';
    input.style.height = '12px';
    input.style.font = '12px sans-serif';
    input.style.outline = 'none';
    input.focus();
  }

  private cancelCellEdition(element, saveElement: boolean, addElements?: boolean) {
    if (element.children.length > 1) {
      if (saveElement) {
        this.undoManegerService.addToBuffer(
          {
            id: element.id,
            oldValue: element.children[0].textContent,
            newValue: element.children[1].value
          });
        element.children[0].textContent = element.children[1].value;
      }
      element.removeChild(element.children[1]);
      element.children[0].style.display = 'inherit';

    } else if (addElements) {
      this.addInput();
    }
    element.className = '';
  }

  private selectElement() {
    const element = <HTMLElement>this._elementRef.nativeElement;
    element.className = 'selected';
    this.datagridService.selectedElement = element;
    this.datagridService.selectedElementId = element.id;
  }

  private removeSelection(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.className = '';
      this.cancelCellEdition(element, true);
    }
  }
}
