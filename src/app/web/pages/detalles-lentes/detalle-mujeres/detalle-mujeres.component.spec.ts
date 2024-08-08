import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleMujeresComponent } from './detalle-mujeres.component';

describe('DetalleMujeresComponent', () => {
  let component: DetalleMujeresComponent;
  let fixture: ComponentFixture<DetalleMujeresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleMujeresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DetalleMujeresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
