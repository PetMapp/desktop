import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlternativeHeaderComponent } from './alternative-header.component';

describe('AlternativeHeaderComponent', () => {
  let component: AlternativeHeaderComponent;
  let fixture: ComponentFixture<AlternativeHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlternativeHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlternativeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
