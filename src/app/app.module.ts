import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';

@NgModule({
    imports: [
        BrowserModule,
        CommonModule
    ],
    declarations: [AppComponent],
    exports: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
