import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatagridComponent } from './datagrid.component';

import { EditableDirective } from './directives/editable.directive';
import { KeyboardEventsDirective } from './directives/keyboard-events.directive';
import { SortableDirective } from './directives/sortable.directive';

import { UndoManagerService } from './services/undo-manager/undo-manager.service';
import { DatagridService } from './datagrid.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DatagridComponent,
    EditableDirective,
    KeyboardEventsDirective,
    SortableDirective
  ],
  providers: [
    DatagridService,
    UndoManagerService
  ],
  exports: [
    DatagridComponent
  ]
})
export class DatagridModule { }
