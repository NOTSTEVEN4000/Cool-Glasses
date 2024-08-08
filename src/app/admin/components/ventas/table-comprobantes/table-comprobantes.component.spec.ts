import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableComprobantesComponent } from './table-comprobantes.component';

describe('TableComprobantesComponent', () => {
  let component: TableComprobantesComponent;
  let fixture: ComponentFixture<TableComprobantesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableComprobantesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TableComprobantesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
