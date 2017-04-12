import { Directive, ElementRef, HostListener, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[ngEditable]'
})
export class EditableDirective implements AfterViewInit {

  constructor(private _elementRef: ElementRef) { }

  ngAfterViewInit() {
    if (this._elementRef.nativeElement.id === '0-0') {
      this.selectElement();
    }
  }

  @HostListener('click') onClick() {
    this.selectElement();
  }

  @HostListener('dblclick') onDoubleClick() {
    this.addInput();
  }

  @HostListener('document:click', ['$event']) onClickOut(event) {
    const clickedInside = this._elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.cancelCellEdition(true);
      this.removeSelection();
    }
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

  private cancelCellEdition(saveElement: boolean, addElements?: boolean) {
    if (this._elementRef.nativeElement.children.length > 1) {
      if (saveElement) {
        this._elementRef.nativeElement.children[0].textContent = this._elementRef.nativeElement.children[1].value;
      }
      this._elementRef.nativeElement.removeChild(this._elementRef.nativeElement.children[1]);
      this._elementRef.nativeElement.children[0].style.display = 'inherit';
    } else if (addElements) {
      this.addInput();
    }
  }

  private selectElement() {
    const element = <HTMLElement>this._elementRef.nativeElement;
    element.className = 'selected';
  }

  private removeSelection() {
    this._elementRef.nativeElement.className = '';
  }
}
