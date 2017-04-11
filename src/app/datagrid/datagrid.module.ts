import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatagridComponent } from './datagrid.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [DatagridComponent],
  exports: [DatagridComponent],
})
export class DatagridModule { }
