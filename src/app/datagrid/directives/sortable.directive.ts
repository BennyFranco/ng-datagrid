import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { DatagridService } from '../datagrid.service';

@Directive({
  selector: '[ngSortable]'
})
export class SortableDirective {
  @Input() data: Array<any>;

  private column: number;
  private isAsc = false;

  constructor(
    private _elementRef: ElementRef,
    private datagridService: DatagridService) {
    this._elementRef.nativeElement.classList.add('sortable-header');
  }

  @HostListener('click') onClick() {
    this.datagridService.removeSelection(this.datagridService.selectedElementId);
    this.column = this._elementRef.nativeElement.id.split('-')[1];
    this.datagridService.gridData.sort((a, b) => this.sortData(a, b));
    this.isAsc = this.isAsc ? false : true;
  }

  sortData(data1: any, data2: any) {
    if (data1[this.column] === data2[this.column]) {
      return 0;
    } else if (!this.isAsc) {
      return (data1[this.column] < data2[this.column]) ? -1 : 1;
    } else {
      return (data1[this.column] > data2[this.column]) ? -1 : 1;
    }
  }
}
