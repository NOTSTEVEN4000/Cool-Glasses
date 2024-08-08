import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleNinosComponent } from './detalle-ninos.component';

describe('DetalleNinosComponent', () => {
  let component: DetalleNinosComponent;
  let fixture: ComponentFixture<DetalleNinosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleNinosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleNinosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
