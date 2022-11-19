import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-close',
  templateUrl: './icon-close.component.html',
  styleUrls: ['./icon-close.component.scss'],
})
export class IconCloseComponent implements OnInit {
  @Input() color = '#87858A';
  constructor() {}

  ngOnInit(): void {}
}
