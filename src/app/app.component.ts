import { Component, OnInit, AfterViewInit } from '@angular/core';
import { DatagridService, FormatterType } from './datagrid/datagrid.service';

@Component({
  selector: 'ng-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  // content = this.generateSheetData();
  content = this.datagridService.generateEmptySheetWithNumberOfRowsAndColumns(1000, 50);
  // content = this.datagridService.generateEmptySheetWithNumberOfRowsAndColumns(10, 10);

  // content = this.generateSheetWithRows(10);
  constructor(private datagridService: DatagridService) {
    // this.datagridService.gridData = this.content;
  }

  ngOnInit() {
  }

  ngAfterViewInit(): void {

    /*this.datagridService.disableRow(2);
    // this.datagridService.formatColumn(1, FormatterType.Number);
    this.datagridService.formatRangeOfCells('0-1', '1-1', FormatterType.Number);
    this.datagridService.formatCellById('2-1', FormatterType.Currency, null, { 'symbolDisplay': true });*/
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
    // this.datagridService.formatRangeOfCells('0-1', '1-1', FormatterType.Number);
    console.log(event);
    // setTimeout(() => {
    this.datagridService.formatCellById(event.id, FormatterType.Number);

    this.datagridService.changeCellValueById('1-0', event.newValue);
    this.datagridService.formatCellById('1-0', FormatterType.Number);

    //  });

    /*setTimeout(() => {
      this.datagridService.addCellCustomStyle(event.row, event.column, { 'background-color': 'blueviolet', 'color': 'white' });

      if (event.column !== 0) {
        const total = (Number.parseFloat(this.content[0][1])) + (Number.parseFloat(this.content[1][1]));
        this.datagridService.changeCellValue(2, 1, total);
        // this.datagridService.formatColumn(1, FormatterType.Number);
        this.datagridService.formatRangeOfCells('0-1', '1-1', FormatterType.Number);
        this.datagridService.formatCellById('2-1', FormatterType.Currency, null, { 'symbolDisplay': true });
      }
    }, 100);*/
  }

  gridData(event) {
    console.log(event);
  }
}
