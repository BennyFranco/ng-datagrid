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
  template: `
            <table ngEditable ngKeyboardEvents [rowLimit]="rowLimit" [colLimit]="colLimit">
            <thead>
              <tr class="_th">
                <th id="blank-cell" class="_th _tr"></th>
                <th class="_th _tr"></th>
                <th *ngFor="let header of headers; let headerColIndex = index" id="{{headerColIndex}}">{{header}}</th>
              </tr>
            </thead>
            <tbody ngPaste>
              <tr *ngFor="let row of gridData; let rowId = index;trackBy: trackByFn">
                <th class="_th _tr">{{rowId+1}}</th>
                <td *ngFor="let cell of row; let cellId = index" id="{{rowId}}-{{cellId}}">
                  <span>{{cell}}</span>
                </td>
              </tr>
            </tbody>
          </table>
  `,
  styles: [
    `
        table {
            border-collapse: separate;
            table-layout: fixed !important;
            word-break: break-all;
            border-spacing: 0;
            font: 12px sans-serif;
            color: #333;
            width: 100%;
            height: 100%;
            display: block;
            overflow: auto;
            -webkit-overflow-scrolling: scroll;
            position: relative;
            border: 0.5px solid #ccc;
        }

        thead {
            background-color: #ddd;
        }

        ._th {
            font-weight: bold;
            background: #ddd;
        }

        ._tr {
            width: auto;
            min-width: 25px;
        }

        ._space {
            width: 100%
        }

        th {
            font-weight: bold;
            background: #ddd;
        }

        th,
        td {
            padding: 0.5em;
            height: 12px;
            width: 60px;
            line-height: 12px;
            min-height: 12px;
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
        }

        td {
            cursor: cell;
        }

        td span {
            display: block;
            width: 60px !important;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .selected {
            box-shadow: inset 0 0 0 2px blue;
        }

        .sortable-header {
            cursor: pointer;
        }

        .sortable-header:hover {
            text-decoration: underline;
        }

        .disable {
            color: rgba(160, 160, 160, 1) !important;
        }

        .format-error {
            background: red !important;
            color: white !important;
        }

        .top-left {
            position: absolute;
            top: 0;
            left: 0;
            border-right: 1px solid #ccc;
            border-bottom: 1px solid #ccc;
            width: 25px;
            height: 12px;
        }
    `
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DatagridComponent implements OnInit, AfterViewInit {

  @Input() gridData: Array<any>;
  @Input() headers: Array<any>;
  @Output() gridDataChange = new EventEmitter();
  @Output() onCellChange: EventEmitter<any>;

  rowLimit: number;
  colLimit: number;

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
