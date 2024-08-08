import { TestBed } from '@angular/core/testing';

import { ServiceBuscadorService } from './service-buscador.service';

describe('ServiceBuscadorService', () => {
  let service: ServiceBuscadorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceBuscadorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
