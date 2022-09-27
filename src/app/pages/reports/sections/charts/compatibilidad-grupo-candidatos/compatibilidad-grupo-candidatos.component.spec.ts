import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompatibilidadGrupoCandidatosComponent } from './compatibilidad-grupo-candidatos.component';

describe('CompatibilidadGrupoCandidatosComponent', () => {
  let component: CompatibilidadGrupoCandidatosComponent;
  let fixture: ComponentFixture<CompatibilidadGrupoCandidatosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompatibilidadGrupoCandidatosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CompatibilidadGrupoCandidatosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
