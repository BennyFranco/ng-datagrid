import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatagridComponent } from './datagrid.component';

import { EditableDirective } from './directives/editable.directive';
import { KeyboardEventsDirective } from './directives/keyboard-events.directive';
import { SortableDirective } from './directives/sortable.directive';

import { UndoManagerService } from './services/undo-manager/undo-manager.service';
import { FormatterService } from './services/formatter/formatter.service';
import { DatagridService } from './datagrid.service';

import { DecimalPipe, CurrencyPipe } from '@angular/common';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DatagridComponent,
    EditableDirective,
    KeyboardEventsDirective,
    SortableDirective,
  ],
  providers: [
    DatagridService,
    UndoManagerService,
    FormatterService,
    DecimalPipe,
    CurrencyPipe
  ],
  exports: [
    DatagridComponent
  ]
})
export class DatagridModule { }
