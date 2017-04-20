import { Directive, ElementRef, HostListener, Input } from '@angular/core';
@Directive({
  selector: '[myMultiselect]'
})
export class MultiselectDirective {

  constructor(private el: ElementRef) { }
 /**
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight(null);
  }
*/
@HostListener('mousedown') onMouseDown(){
 this.highlight('yellow');
}
@HostListener('mouseup') onMouseSeup() {
    this.highlight('blue');
  }   
  private highlight(color: string) {
    this.el.nativeElement.style.color = color;
  }
}