import { DatagridService } from './datagrid.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatagridComponent } from './datagrid.component';

import { EditableDirective } from './directives/editable.directive';
import { KeyboardNavigationDirective } from './directives/keyboard-navigation.directive';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    DatagridComponent,
    EditableDirective,
    KeyboardNavigationDirective
  ],
  providers: [
    DatagridService
  ],
  exports: [
    DatagridComponent
  ]
})
export class DatagridModule { }
