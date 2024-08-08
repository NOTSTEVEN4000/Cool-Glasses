import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderDinamicoComponent } from './header-dinamico.component';

describe('HeaderDinamicoComponent', () => {
  let component: HeaderDinamicoComponent;
  let fixture: ComponentFixture<HeaderDinamicoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderDinamicoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HeaderDinamicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
