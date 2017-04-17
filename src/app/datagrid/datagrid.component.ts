import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'ng-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css']
})
export class DatagridComponent implements OnInit {

  @Input() gridData: Array<any>;
  @Input() headers: Array<any>;

  constructor() {}

  ngOnInit() {
    if (!this.gridData) {
      this.gridData = this.generateEmptySheetWithNumberOfRows(15);
    }

    if (!this.headers) {
      this.headers = this.generateHeaders();
    }
  }

  generateEmptySheet(): Array<any> {
    return [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null]
    ];
  }

  generateEmptySheetWithNumberOfRows(rows: number): Array<any> {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix.push([null, null, null, null, null, null, null, null]);
    }
    return matrix;
  }

  generateZeroSheet(): Array<any> {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
  }

  generateZeroSheetWithNumberOfRows(rows: number): Array<any> {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    return matrix;
  }

  generateHeaders(): Array<any> {
    const letters = 'a b c d e f g h i j k l m n o p q r s t u v w x y z'.toUpperCase().split(' ');
    const headers = [];
    if (this.gridData.length > 0) {
      ([...this.gridData].pop()).forEach((element, idx) => headers.push(letters[idx]));
    }
    return headers;
  }
}
