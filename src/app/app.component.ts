import { DatagridService } from './datagrid/datagrid.service';
import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'ng-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  content = this.generateSheetData();

  constructor(private datagridService: DatagridService) { }

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.datagridService.disableRow(2);
  }

  generateSheetWithRows(rows: number): Array<any> {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix.push(['Lorem', 'ipsum', 'dolor', 'sit', 'amet']);
    }
    return matrix;
  }

  generateSheetData(): Array<any> {
    return [
     ['0', 1, 2],
     ['1', 0, 0],
     ['2', 0, 0],
     ['3', 0, 0],
     ['4', 0, 0],
     ['5', 0, 0],
     ['6', 0, 0],
     ['TOTAL', 0, 0]
    ];
  }

  cellChange(event) {
    console.log(event);
    setTimeout(() => {
      const total = (Number.parseFloat(this.content[0][1])) + (Number.parseFloat(this.content[1][1]));
      this.datagridService.changeCellValue(2, 1, total);
      console.log(this.content[0][1]);
      // this.datagridService.addCellCustomClass(event.row, event.column, 'cell-changed');
      this.datagridService.addCellCustomStyle(event.row, event.column, {'background-color': 'blueviolet', 'color': 'white'});

    }, 100);
  }

  gridData(event) {
    console.log(event);
  }
}
