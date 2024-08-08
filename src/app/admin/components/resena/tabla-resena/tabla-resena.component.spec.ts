import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaResenaComponent } from './tabla-resena.component';

describe('TablaResenaComponent', () => {
  let component: TablaResenaComponent;
  let fixture: ComponentFixture<TablaResenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaResenaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TablaResenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
