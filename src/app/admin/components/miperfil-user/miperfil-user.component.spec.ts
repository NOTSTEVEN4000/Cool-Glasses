import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MiperfilUserComponent } from './miperfil-user.component';

describe('MiperfilUserComponent', () => {
  let component: MiperfilUserComponent;
  let fixture: ComponentFixture<MiperfilUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MiperfilUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MiperfilUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
