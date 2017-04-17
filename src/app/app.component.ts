import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ng-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  content = this.generateEmptySheetWithNumberOfRows(10);
  constructor() { }

  ngOnInit() {

  }

  generateEmptySheetWithNumberOfRows(rows: number): Array<any> {
    const matrix = [];
    for (let i = 0; i < rows; i++) {
      matrix.push(['Lorem', 'ipsum', 'dolor', 'sit', 'amet']);
    }
    return matrix;
  }
}
