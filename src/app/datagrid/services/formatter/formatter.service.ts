import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';

@Injectable()
export class FormatterService {

  constructor(private decimalPipe: DecimalPipe) { }

  decimalFormat(id: string) {
    const domElement = document.getElementById(id);
    domElement.firstElementChild.textContent = this.decimalPipe.transform(domElement.firstElementChild.textContent, '1.2');
  }
}
