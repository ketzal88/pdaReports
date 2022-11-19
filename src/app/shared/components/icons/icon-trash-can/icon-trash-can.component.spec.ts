import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IconTrashCanComponent } from './icon-trash-can.component';

describe('IconTrashCanComponent', () => {
  let component: IconTrashCanComponent;
  let fixture: ComponentFixture<IconTrashCanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IconTrashCanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IconTrashCanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
