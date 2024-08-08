import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Slider3DComponent } from './slider3-d.component';

describe('Slider3DComponent', () => {
  let component: Slider3DComponent;
  let fixture: ComponentFixture<Slider3DComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Slider3DComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Slider3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
