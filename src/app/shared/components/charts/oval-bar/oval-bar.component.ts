import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-oval-bar',
  templateUrl: './oval-bar.component.html',
  styleUrls: ['./oval-bar.component.scss'],
})
export class OvalBarComponent implements OnInit {
  @Input() background: string = '#d5d7d9';
  @Input() hasTooltip: boolean = true;
  @Input() tooltip: string;

  constructor() {}

  ngOnInit(): void {}
}
