import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ng-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  content = this.generateSheetData();
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
      ['A', 4],
      ['B', 2],
      ['TOTAL', 6]
    ];
  }

  cellChange(event) {
    console.log(event);
    setTimeout(() => {
      this.content[2][1] = (Number.parseFloat(this.content[0][1])) + (Number.parseFloat(this.content[1][1]));
      console.log(this.content[0][1]);
    }, 100);
  }

  gridData(event) {
    console.log(event);
  }
}
