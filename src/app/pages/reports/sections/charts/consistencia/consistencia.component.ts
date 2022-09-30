import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'chart-consistencia',
  templateUrl: './consistencia.component.html',
  styleUrls: ['./consistencia.component.scss']
})
export class ConsistenciaComponent implements OnInit {
  constructor() { }
  @Input() value: number = 0;
  ngOnInit(): void {
  }
}
