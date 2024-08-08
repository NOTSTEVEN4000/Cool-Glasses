import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageResenaComponent } from './page-resena.component';

describe('PageResenaComponent', () => {
  let component: PageResenaComponent;
  let fixture: ComponentFixture<PageResenaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageResenaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PageResenaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
