import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompatibilidadPuestoComponent } from './compatibilidad-puesto.component';

describe('CompatibilidadPuestoComponent', () => {
  let component: CompatibilidadPuestoComponent;
  let fixture: ComponentFixture<CompatibilidadPuestoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompatibilidadPuestoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatibilidadPuestoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
