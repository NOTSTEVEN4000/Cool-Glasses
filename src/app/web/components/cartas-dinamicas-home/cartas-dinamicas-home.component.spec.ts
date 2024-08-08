import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartasDinamicasHomeComponent } from './cartas-dinamicas-home.component';

describe('CartasDinamicasHomeComponent', () => {
  let component: CartasDinamicasHomeComponent;
  let fixture: ComponentFixture<CartasDinamicasHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartasDinamicasHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CartasDinamicasHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
