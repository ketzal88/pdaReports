import { Component, Input, OnInit } from '@angular/core';
import { TypeBehavioralItem } from '../../../../pages/reports/sections/behavioral-trend/interfaces/type-behavioral.interface';

@Component({
  selector: 'app-behavioral-bar',
  templateUrl: './behavioral-bar.component.html',
  styleUrls: ['./behavioral-bar.component.scss'],
})
export class BehavioralBarComponent implements OnInit {
  @Input() active: boolean = false;
  @Input() values: TypeBehavioralItem[];
  constructor() {}

  ngOnInit(): void {}
}
