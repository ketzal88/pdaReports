import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepnaComponent } from './repna.component';

describe('RepnaComponent', () => {
  let component: RepnaComponent;
  let fixture: ComponentFixture<RepnaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepnaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepnaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
