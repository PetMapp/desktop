import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppearenceComponent } from './appearence.component';

describe('AppearenceComponent', () => {
  let component: AppearenceComponent;
  let fixture: ComponentFixture<AppearenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppearenceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppearenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
