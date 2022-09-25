import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SmallBarWithNotchComponent } from './small-bar-with-notch.component';

describe('SmallBarWithNotchComponent', () => {
  let component: SmallBarWithNotchComponent;
  let fixture: ComponentFixture<SmallBarWithNotchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SmallBarWithNotchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallBarWithNotchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
