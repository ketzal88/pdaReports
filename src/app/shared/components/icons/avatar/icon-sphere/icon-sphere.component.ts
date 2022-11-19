import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-icon-sphere',
  templateUrl: './icon-sphere.component.html',
  styleUrls: ['./icon-sphere.component.scss'],
})
export class IconSphereComponent implements OnInit {
  @Input() width: string;
  constructor() {}

  ngOnInit(): void {}
}
