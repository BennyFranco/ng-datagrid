import { Injectable } from '@angular/core';

@Injectable()
export class FormatterService {

  constructor() { }

  numberFormatter(value: any, decimals?: number, sections?: number): Number {
    const re = '\\d(?=(\\d{' + (sections || 3) + '})+' + (decimals > 0 ? '\\.' : '$') + ')';
    // tslint:disable-next-line:no-bitwise
    return value.toFixed(Math.max(0, ~~decimals)).replace(new RegExp(re, 'g'), '$&,');
  }

}
