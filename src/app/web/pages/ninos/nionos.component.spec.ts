import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NionosComponent } from './nionos.component';

describe('NionosComponent', () => {
  let component: NionosComponent;
  let fixture: ComponentFixture<NionosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NionosComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NionosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
