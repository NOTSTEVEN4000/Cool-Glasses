import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageBuscadorProductoComponent } from './page-buscador-producto.component';

describe('PageBuscadorProductoComponent', () => {
  let component: PageBuscadorProductoComponent;
  let fixture: ComponentFixture<PageBuscadorProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageBuscadorProductoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageBuscadorProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
