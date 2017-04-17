import { Directive, Input, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[ngSortable]'
})
export class SortableDirective {
  @Input() data: Array<any>;

  private column: number;
  private isAsc = false;

  constructor(private _elementRef: ElementRef) { }

  @HostListener('click') onClick() {
    this.column = this._elementRef.nativeElement.id;
    this.data.sort((a, b) => this.sortData(a, b));
    this.isAsc = this.isAsc ? false : true;
  }

  sortData(data1: any, data2: any) {
    console.log(this.column);
    if (data1[this.column] === data2[this.column]) {
      return 0;
    } else if (!this.isAsc) {
      return (data1[this.column] < data2[this.column]) ? -1 : 1;
    } else {
      return (data1[this.column] > data2[this.column]) ? -1 : 1;
    }
  }
}
