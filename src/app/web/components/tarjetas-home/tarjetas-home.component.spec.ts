import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetasHomeComponent } from './tarjetas-home.component';

describe('TarjetasHomeComponent', () => {
  let component: TarjetasHomeComponent;
  let fixture: ComponentFixture<TarjetasHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetasHomeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TarjetasHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
