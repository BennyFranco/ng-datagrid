import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ng-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  content = this.generateSheetWithRows(15);
  constructor() { }

  ngOnInit() {

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
      [14, 'AAAA'],
      [12, 'BBBB'],
      [11, 'CCCC'],
      [13, 'DDDD']
    ];
  }
}
