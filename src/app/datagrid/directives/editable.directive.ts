import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[ngEditable]'
})
export class EditableDirective {

  constructor(private el: ElementRef) { }

  @HostListener('dblclick') onDobleClick() {
    this.highlight('yellow');
  }

  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
