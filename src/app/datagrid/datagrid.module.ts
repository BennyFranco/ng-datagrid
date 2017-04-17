import { UndoManagerService } from './services/undo-manager.service';
import { DatagridService } from './datagrid.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatagridComponent } from './datagrid.component';

import { EditableDirective } from './directives/editable.directive';
import { KeyboardEventsDirective } from './directives/keyboard-events.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DatagridComponent,
    EditableDirective,
    KeyboardEventsDirective
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
