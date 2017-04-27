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
  @Input() schema: any;
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
    if (!this.gridData && !this.schema) {
      this.gridData = this.datagridService.generateEmptySheetWithNumberOfRows(15);
    } else if (this.schema && !this.gridData) {
      this.loadSchema();
    }

    if (!this.headers) {
      this.headers = this.generateHeaders();
    }

    this.createRowAndColLimits();
    this.datagridService.gridData = this.gridData;
  }

  ngAfterViewInit() {
    this.datagridService.selectElement(null, '0-0');
    this.datagridService.fixElements();
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
      document.getElementById(id).classList.add('newClass');
      if (this.area.indexOf(id) === -1) {
        this.area.push(id);
      }
    }
  }

  selectArea() {
    const fromArray = this.from.split('-');
    const toArray = this.to.split('-');

    if (Number.parseInt(fromArray[0]) < Number.parseInt(toArray[0])) {
      for (let row = Number.parseInt(fromArray[0]); row <= Number.parseInt(toArray[0]); row++) {
        for (let col = Number.parseInt(fromArray[1]); col <= Number.parseInt(toArray[1]); col++) {
          document.getElementById(row + '-' + col).classList.add('newClass');
          if (this.area.indexOf(row + '-' + col) === -1) {
            this.area.push(row + '-' + col);
          }
        }
      }
    } else {
      for (let row = Number.parseInt(fromArray[0]); row >= Number.parseInt(toArray[0]); row--) {
        for (let col = Number.parseInt(fromArray[1]); col >= Number.parseInt(toArray[1]); col--) {
          document.getElementById(row + '-' + col).classList.add('newClass');
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

  loadSchema() {
    this.gridData = [];

    const keys = [];

    this.schema.forEach(schema => {
      const row = [];
      for (const key in schema) {
        if (schema.hasOwnProperty(key)) {
          row.push(schema[key]);
        }
      }
      this.gridData.push(row);
    });

    const schema = ([...this.schema].pop());
    for (const key in schema) {
      if (schema.hasOwnProperty(key)) {
        keys.push(key);
      }
    }

    this.datagridService.keysOfSchema = keys;
  }
}
