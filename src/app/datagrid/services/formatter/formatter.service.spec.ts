import { TestBed, inject } from '@angular/core/testing';

import { FormatterService } from './formatter.service';

describe('FormatterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatterService]
    });
  });

  it('should format the number 12345 to 12,345', inject([FormatterService], (service: FormatterService) => {
    const formattedNumber = service.numberFormatter(12345);
    expect(formattedNumber.toString()).toBe('12,345');
  }));

  it('should format the number 12345.255 to 12,345.25', inject([FormatterService], (service: FormatterService) => {
    const formattedNumber = service.numberFormatter(12345.255, 2);
    expect(formattedNumber.toString()).toBe('12,345.25');
  }));
});
