import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BalanceEdadGeneroComponent} from './balance-edad-genero.component';

describe('BalanceDedadGeneroComponent', () => {
  let component: BalanceEdadGeneroComponent;
  let fixture: ComponentFixture<BalanceEdadGeneroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BalanceEdadGeneroComponent]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BalanceEdadGeneroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
