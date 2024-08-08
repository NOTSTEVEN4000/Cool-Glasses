import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropdownUserComponent } from './dropdown-user.component';

describe('DropdownUserComponent', () => {
  let component: DropdownUserComponent;
  let fixture: ComponentFixture<DropdownUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DropdownUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DropdownUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
