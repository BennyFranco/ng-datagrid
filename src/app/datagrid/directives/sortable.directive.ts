import { Directive, Input, HostListener, ElementRef } from '@angular/core';
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
    this._elementRef.nativeElement.className = 'sortable-header ';
  }

  @HostListener('click') onClick() {
    this.removeSelection(this.datagridService.selectedElementId);
    this.column = this._elementRef.nativeElement.id;
    this.data.sort((a, b) => this.sortData(a, b));
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

  private removeSelection(id?: string) {
    if (id) {
      const element = document.getElementById(id);
      element.classList.remove('selected');
      this.cancelCellEdition(element, false);
    }
  }

  private cancelCellEdition(element, saveElement: boolean) {
    if (element.children.length > 1) {
      if (saveElement) {
        element.children[0].textContent = element.children[1].value;
      }
      element.removeChild(element.children[1]);
      element.children[0].style.display = 'inherit';
    }
  }
}
