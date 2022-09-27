import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsistenciaComponent } from './consistencia.component';

describe('ConsistenciaComponent', () => {
  let component: ConsistenciaComponent;
  let fixture: ComponentFixture<ConsistenciaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsistenciaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsistenciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
