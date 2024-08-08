import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaleriaImagenesHomeComponent } from './galeria-imagenes-home.component';

describe('GaleriaImagenesHomeComponent', () => {
  let component: GaleriaImagenesHomeComponent;
  let fixture: ComponentFixture<GaleriaImagenesHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GaleriaImagenesHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GaleriaImagenesHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
