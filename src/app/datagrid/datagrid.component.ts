import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ng-datagrid',
  templateUrl: './datagrid.component.html',
  styleUrls: ['./datagrid.component.css']
})
export class DatagridComponent implements OnInit {

  gridData: Array<any>;
  headers: Array<any>;

  constructor() {
    this.gridData = this.generateMockData();
    this.headers = this.generateHeaders();
  }

  ngOnInit() {
  }

  generateMockData(): Array<any> {
    return [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0]
    ];
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
