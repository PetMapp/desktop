import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonIconComponent } from './iconButton.component';

describe('ButtonComponent', () => {
  let component: ButtonIconComponent;
  let fixture: ComponentFixture<ButtonIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtonIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
