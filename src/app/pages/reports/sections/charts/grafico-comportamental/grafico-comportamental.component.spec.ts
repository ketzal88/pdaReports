import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoComportamentalComponent } from './grafico-comportamental.component';

describe('GraficoComportamentalComponent', () => {
  let component: GraficoComportamentalComponent;
  let fixture: ComponentFixture<GraficoComportamentalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraficoComportamentalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoComportamentalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
