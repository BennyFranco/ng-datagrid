import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatagridService, FormatterType } from './datagrid/datagrid.service';

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
    this.datagridService.formatColumn(1, FormatterType.Number);
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
      ['A', 1200],
      ['B', 2],
      ['TOTAL', 1202]
    ];
  }

  cellChange(event) {
    console.log(event);

    setTimeout(() => {
      if (event.column !== 0) {
        this.datagridService.formatCellById(event.id, FormatterType.Number);

        const total = (Number.parseFloat(this.content[0][1])) + (Number.parseFloat(this.content[1][1]));
        this.datagridService.changeCellValue(2, 1, total);
        this.datagridService.addCellCustomStyle(event.row, event.column, { 'background-color': 'blueviolet', 'color': 'white' });
        this.datagridService.formatCellById('2-1', FormatterType.Number);
      }
    }, 100);
  }

  gridData(event) {
    console.log(event);
  }
}
