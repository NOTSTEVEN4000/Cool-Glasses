import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionTeamComponent } from './seccion-team.component';

describe('SeccionTeamComponent', () => {
  let component: SeccionTeamComponent;
  let fixture: ComponentFixture<SeccionTeamComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionTeamComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeccionTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
