import { TestBed, inject } from '@angular/core/testing';

import { UndoManagerService } from './undo-manager.service';

describe('UndoManagerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UndoManagerService]
    });
  });

  it('should ...', inject([UndoManagerService], (service: UndoManagerService) => {
    expect(service).toBeTruthy();
  }));
});
