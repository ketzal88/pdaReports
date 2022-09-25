import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TendenciaComportamentalComponent } from './tendencia-comportamental.component';

describe('TendenciaComportamentalComponent', () => {
  let component: TendenciaComportamentalComponent;
  let fixture: ComponentFixture<TendenciaComportamentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TendenciaComportamentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TendenciaComportamentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
