import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconComponentComponent } from './icon-component.component';

describe('IconComponentComponent', () => {
  let component: IconComponentComponent;
  let fixture: ComponentFixture<IconComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IconComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IconComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
