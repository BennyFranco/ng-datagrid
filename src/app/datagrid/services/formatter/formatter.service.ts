import { throws } from 'assert';
import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { UndoManagerService } from '../undo-manager/undo-manager.service';

@Injectable()
export class FormatterService {

  undoManager: UndoManagerService;

  constructor(
    private decimalPipe: DecimalPipe) { }

  decimalFormat(id: string, digits?: string, errorClass?: string) {
    digits = digits ? digits : '1.2';
    const domElement = document.getElementById(id);

    try {
      domElement.firstElementChild.textContent = this.decimalPipe
        .transform(domElement.firstElementChild.textContent.replace(',', ''), digits);
      domElement.classList.remove('format-error');
    } catch (error) {
      errorClass = errorClass ? errorClass : 'format-error';
      domElement.classList.add(errorClass);
    }
  }
}
