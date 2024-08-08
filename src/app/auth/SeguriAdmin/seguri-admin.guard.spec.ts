import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { seguriAdminGuard } from './seguri-admin.guard';

describe('seguriAdminGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => seguriAdminGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
