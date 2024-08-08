import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SliderImagenesComponent } from './slider-imagenes.component';

describe('SliderImagenesComponent', () => {
  let component: SliderImagenesComponent;
  let fixture: ComponentFixture<SliderImagenesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SliderImagenesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SliderImagenesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
