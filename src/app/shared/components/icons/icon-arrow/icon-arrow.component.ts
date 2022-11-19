import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-arrow',
  templateUrl: './icon-arrow.component.html',
  styleUrls: ['./icon-arrow.component.scss'],
})
export class IconArrowComponent implements OnInit {
  @Input() color: string;
  @Input() rotate: string = 'rotate(0)';

  constructor() {}

  ngOnInit(): void {}
}
