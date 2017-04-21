import { AfterViewInit, ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DatagridService } from './datagrid.service';

@Component({
  selector: 'ng-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent implements OnInit, AfterViewInit {

  @Input() gridData: Array<any>;
  @Input() headers: Array<any>;
  @Output() gridDataChange = new EventEmitter();
  @Output() onCellChange: EventEmitter<any>;

  rowLimit: number;
  colLimit: number;

  constructor(private datagridService: DatagridService) {
    this.gridDataChange = this.datagridService.gridDataChange;
    this.onCellChange = this.datagridService.onCellChange;
  }

  ngOnInit() {
    if (!this.gridData) {
      this.gridData = this.datagridService.generateEmptySheetWithNumberOfRows(15);
    }

    if (!this.headers) {
      this.headers = this.generateHeaders();
    }

    this.createRowAndColLimits();
    this.datagridService.gridData = this.gridData;
  }

  ngAfterViewInit() {
    this.datagridService.selectElement(null, '0-0');
  }

  private createRowAndColLimits() {
    this.rowLimit = this.gridData.length;
    if (this.gridData.length > 0) {
      this.colLimit = this.gridData[0].length;
    }
  }

  private generateHeaders(): Array<any> {
    const letters = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.toUpperCase().split(' ');
    const headers = [];
    let secondIdx = 0;
    let count = 0;
    if (this.gridData.length > 0) {
      ([...this.gridData].pop()).forEach((element, idx) => {
        if (idx < letters.length) {
          headers.push(letters[idx]);
        } else {
          if (count === letters.length) {
            secondIdx++;
            count = 0;
          }
          headers.push(letters[secondIdx] + letters[count]);
          count++;
        }
      });
    }
    return headers;
  }
}
