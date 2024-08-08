import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RatingUsuarioComponent } from './rating-usuario.component';

describe('RatingUsuarioComponent', () => {
  let component: RatingUsuarioComponent;
  let fixture: ComponentFixture<RatingUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingUsuarioComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RatingUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
