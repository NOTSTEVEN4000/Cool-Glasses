import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoFlotanteComponent } from './logo-flotante.component';

describe('LogoFlotanteComponent', () => {
  let component: LogoFlotanteComponent;
  let fixture: ComponentFixture<LogoFlotanteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LogoFlotanteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LogoFlotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
