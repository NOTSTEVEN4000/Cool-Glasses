import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageComprobantesComponent } from './page-comprobantes.component';

describe('PageComprobantesComponent', () => {
  let component: PageComprobantesComponent;
  let fixture: ComponentFixture<PageComprobantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageComprobantesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageComprobantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
