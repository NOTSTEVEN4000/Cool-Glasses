import { TestBed } from '@angular/core/testing';

import { FilterProductosService } from './filter-productos.service';

describe('FilterProductosService', () => {
  let service: FilterProductosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilterProductosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
