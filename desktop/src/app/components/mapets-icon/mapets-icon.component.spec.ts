import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapetsIconComponent } from './mapets-icon.component';

describe('MapetsIconComponent', () => {
  let component: MapetsIconComponent;
  let fixture: ComponentFixture<MapetsIconComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapetsIconComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapetsIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
