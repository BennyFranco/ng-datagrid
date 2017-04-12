import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[ngEditable]'
})
export class EditableDirective {

  constructor(private _elementRef: ElementRef) { }

  @HostListener('dblclick') onDobleClick() {
    this.addInput();
  }

  @HostListener('document:click', ['$event']) onClickOut(event) {
    const clickedInside = this._elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this._elementRef.nativeElement.style.border = '1px solid #ddd';

      if (this._elementRef.nativeElement.children.length > 1) {
        this._elementRef.nativeElement.children[0].textContent = this._elementRef.nativeElement.children[1].value;
        this._elementRef.nativeElement.removeChild(this._elementRef.nativeElement.children[1]);
        this._elementRef.nativeElement.children[0].style.display = 'inherit';
      }
    }
  }

  @HostListener('click') onclick() {
    this._elementRef.nativeElement.style.border = '2px solid blue';
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
    input.focus();
  }
}
