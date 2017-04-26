import { TestBed, inject } from '@angular/core/testing';

import { FormatterService } from './formatter.service';

describe('FormatterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FormatterService]
    });
  });

  it('should ...', inject([FormatterService], (service: FormatterService) => {
    expect(service).toBeTruthy();
  }));
});
