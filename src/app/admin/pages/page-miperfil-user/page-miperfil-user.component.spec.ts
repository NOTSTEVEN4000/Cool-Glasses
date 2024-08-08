import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageMiperfilUserComponent } from './page-miperfil-user.component';

describe('PageMiperfilUserComponent', () => {
  let component: PageMiperfilUserComponent;
  let fixture: ComponentFixture<PageMiperfilUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageMiperfilUserComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageMiperfilUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
