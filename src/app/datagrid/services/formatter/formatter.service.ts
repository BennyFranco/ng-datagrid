import { throws } from 'assert';
import { Injectable } from '@angular/core';
import { DecimalPipe, CurrencyPipe } from '@angular/common';
import { UndoManagerService } from '../undo-manager/undo-manager.service';

@Injectable()
export class FormatterService {

  undoManager: UndoManagerService;

  digits = '1.2';
  currencyCode: string;
  symbolDisplay: boolean;
  digitInfo: string;

  constructor(
    private decimalPipe: DecimalPipe,
    private currencyPipe: CurrencyPipe) { }

  decimalFormat(id: string, errorClass?: string) {
    const domElement = document.getElementById(id);

    try {
      domElement.firstElementChild.textContent = this.decimalPipe
        .transform(domElement.firstElementChild.textContent.replace(',', ''), this.digits);
      domElement.classList.remove('format-error');
    } catch (error) {
      errorClass = errorClass ? errorClass : 'format-error';
      domElement.classList.add(errorClass);
    }
  }

  currencyFormat(id: string, errorClass?: string) {
    const domElement = document.getElementById(id);

    try {
      domElement.firstElementChild.textContent = this.currencyPipe
        .transform(domElement.firstElementChild.textContent.replace(',', ''), this.currencyCode, this.symbolDisplay, this.digitInfo);
      domElement.classList.remove('format-error');
    } catch (error) {
      errorClass = errorClass ? errorClass : 'format-error';
      domElement.classList.add(errorClass);
    }
  }
}
