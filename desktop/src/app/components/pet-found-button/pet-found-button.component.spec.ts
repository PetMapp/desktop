import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PetFoundButtonComponent } from './pet-found-button.component';

describe('PetFoundButtonComponent', () => {
  let component: PetFoundButtonComponent;
  let fixture: ComponentFixture<PetFoundButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PetFoundButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PetFoundButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
