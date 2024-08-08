import { TestBed } from '@angular/core/testing';

import { ConexionusuarioService } from './conexionusuario.service';

describe('ConexionusuarioService', () => {
  let service: ConexionusuarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConexionusuarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
