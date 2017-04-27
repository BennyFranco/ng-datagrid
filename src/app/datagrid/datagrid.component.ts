import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output
} from '@angular/core';
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
  color: string;
  private area: Array<String> = [];
  private pressed = false;
  private from: string;
  private to: string;

  constructor(
    private datagridService: DatagridService,
    private zone: NgZone) {
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
    this.fixedHeaders();
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

  onSelectionStart(rowId, cellId) { // 'row-column'  ex. '0-0' '0-1'
    if (!this.pressed && this.area.length == 0) {
      this.pressed = true;
      let id = rowId + '-' + cellId;
      this.from = id;
    } else {
      this.pressed = false;
      console.log('Array lleno');
    }

  }
  onSelection(rowId, cellId) {
    const id = rowId + '-' + cellId;

    if (this.pressed) {
      this.to = id;
      this.selectArea();
      document.getElementById(id).className = 'newClass';
      if (this.area.indexOf(id) === -1) {
        this.area.push(id);
      }
    }
  }
  selectArea() {
    const fromArray = this.from.split('-');
    const toArray = this.to.split('-');

  if (Number.parseInt(fromArray[0]) < Number.parseInt(toArray[0]) && 
     Number.parseInt(fromArray[1]) < Number.parseInt(toArray[1])) {
      for (let row = Number.parseInt(fromArray[0]); row <= Number.parseInt(toArray[0]); row++) {
        for (let col = Number.parseInt(fromArray[1]); col <= Number.parseInt(toArray[1]); col++) {
          document.getElementById(row + '-' + col).className = 'newClass';
          if (this.area.indexOf(row + '-' + col) === -1) {
            this.area.push(row + '-' + col);
          }
        }
      }
    } if (Number.parseInt(fromArray[0]) > Number.parseInt(toArray[0]) && 
     Number.parseInt(fromArray[1]) > Number.parseInt(toArray[1])) {
       
      for (let row = Number.parseInt(fromArray[0]); row >= Number.parseInt(toArray[0]); row--) {
        for (let col = Number.parseInt(fromArray[1]); col >= Number.parseInt(toArray[1]); col--) {
          document.getElementById(row + '-' + col).className = 'newClass';
          if (this.area.indexOf(row + '-' + col) === -1) {
            this.area.push(row + '-' + col);
          }
        }
      }
    }
    if (Number.parseInt(fromArray[0]) < Number.parseInt(toArray[0]) && 
     Number.parseInt(fromArray[1]) > Number.parseInt(toArray[1])) {
        for (let col = Number.parseInt(fromArray[1]); col <= Number.parseInt(toArray[1]); col--) {
          for (let row = Number.parseInt(fromArray[0]); row <= Number.parseInt(toArray[0]); row++) {
          document.getElementById(row + '-' + col).className = 'newClass';
          if (this.area.indexOf(row + '-' + col) === -1) {
            this.area.push(row + '-' + col);
          }
        }
      }
    } if (Number.parseInt(fromArray[0]) > Number.parseInt(toArray[0]) && 
     Number.parseInt(fromArray[1]) < Number.parseInt(toArray[1])) {
        for (let col = Number.parseInt(fromArray[1]); col <= Number.parseInt(toArray[1]); col++) {
          for (let row = Number.parseInt(fromArray[0]); row <= Number.parseInt(toArray[0]); row--) {
          document.getElementById(row + '-' + col).className = 'newClass';
          if (this.area.indexOf(row + '-' + col) === -1) {
            this.area.push(row + '-' + col);
          }
        }
      }
    } 
  }

  onSelectionEnd() {
    this.pressed = false;
    console.log(this.area.length);
  }

  trackByFn(index, item) {
    return index;
  }

  fixedHeaders() {
    const table = document.querySelector('table');
    const leftHeaders = [].concat.apply([], document.querySelectorAll('tbody th'));
    const topHeaders = [].concat.apply([], document.querySelectorAll('thead th'));

    const topLeft = document.getElementById('blank-cell');
    const computed = window.getComputedStyle(topHeaders[0]);
    topLeft.classList.add('top-left');
    table.appendChild(topLeft);

    this.zone.runOutsideAngular(() => {
      table.addEventListener('scroll', (e) => {
        const x = table.scrollLeft;
        const y = table.scrollTop;

        leftHeaders.forEach((leftHeader) => {
          leftHeader.style.transform = this.translate(x, 0);
          // leftHeader.style.transition = 'all 0.1s ease';
        });
        topHeaders.forEach((topHeader, i) => {
          if (i === 0) {
            topHeader.style.transform = this.translate(x, y);
          } else {
            topHeader.style.transform = this.translate(0, y);
          }
          // topHeader.style.transition = 'all 0.1s ease';
        });
        topLeft.style.transform = this.translate(x, y);
      });
    });
  }

  translate(x, y): string {
    return 'translate(' + x + 'px, ' + y + 'px)';
  }
}
