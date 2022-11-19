import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-redirect',
  templateUrl: './icon-redirect.component.html',
  styleUrls: ['./icon-redirect.component.scss'],
})
export class IconRedirectComponent implements OnInit {
  @Input() color: string = '#292525';
  @Input() rotate: string = 'rotate(180)';

  constructor() {}

  ngOnInit(): void {}
}
