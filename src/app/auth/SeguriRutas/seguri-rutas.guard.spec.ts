import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { seguriRutasGuard } from './seguri-rutas.guard';

describe('seguriRutasGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => seguriRutasGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
