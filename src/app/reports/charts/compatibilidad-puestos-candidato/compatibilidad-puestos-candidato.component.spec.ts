import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompatibilidadPuestosCandidatoComponent } from './compatibilidad-puestos-candidato.component';

describe('CompatibilidadPuestosCandidatoComponent', () => {
  let component: CompatibilidadPuestosCandidatoComponent;
  let fixture: ComponentFixture<CompatibilidadPuestosCandidatoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompatibilidadPuestosCandidatoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatibilidadPuestosCandidatoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
