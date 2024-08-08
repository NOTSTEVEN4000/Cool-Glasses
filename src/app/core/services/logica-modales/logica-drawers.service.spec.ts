import { TestBed } from '@angular/core/testing';

import { LogicaDrawersService } from './logica-drawers.service';

describe('LogicaDrawersService', () => {
  let service: LogicaDrawersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogicaDrawersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
