import { ChangedCell } from '../dao/changed-cell';
import { DatagridService } from '../datagrid.service';
import { Directive, NgZone, OnInit } from '@angular/core';

@Directive({
  selector: '[ngPaste]'
})
export class PasteDirective implements OnInit {

  constructor(
    private datagridService: DatagridService,
    private zone: NgZone
  ) {
  }

  ngOnInit() {
    this.onPaste();
  }

  onPaste() {
    this.zone.run(() => {
      addEventListener('paste', (event: ClipboardEvent) => {
        const cell = new ChangedCell(this.datagridService.selectedElementId,
          this.datagridService.selectedElement.children[0].textContent, event.clipboardData.getData('text'));
        this.datagridService
          .changeCellValueById(this.datagridService.selectedElementId, event.clipboardData.getData('text'));
        this.datagridService.emitChanges(cell);
      });
    });
  }
}
