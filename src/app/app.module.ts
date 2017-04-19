import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatagridModule } from './datagrid/datagrid.module';

import { AppComponent } from './app.component';


@NgModule({
    imports: [
        BrowserModule,
        CommonModule,
        DatagridModule,
        
    ],
    declarations: [
        AppComponent
    ],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
