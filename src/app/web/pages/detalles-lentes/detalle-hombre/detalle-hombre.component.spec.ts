import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleHombreComponent } from './detalle-hombre.component';

describe('DetalleHombreComponent', () => {
  let component: DetalleHombreComponent;
  let fixture: ComponentFixture<DetalleHombreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleHombreComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleHombreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
