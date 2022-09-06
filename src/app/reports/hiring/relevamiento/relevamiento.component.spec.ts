import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelevamientoComponent } from './relevamiento.component';

describe('RelevamientoComponent', () => {
  let component: RelevamientoComponent;
  let fixture: ComponentFixture<RelevamientoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RelevamientoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelevamientoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
