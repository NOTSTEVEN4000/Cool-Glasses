import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleriaImagenesComponent } from './galleria-imagenes.component';

describe('GalleriaImagenesComponent', () => {
  let component: GalleriaImagenesComponent;
  let fixture: ComponentFixture<GalleriaImagenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GalleriaImagenesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GalleriaImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
