import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-behavioral-description-card',
  templateUrl: './behavioral-description-card.component.html',
  styleUrls: ['./behavioral-description-card.component.scss'],
})
export class BehavioralDescriptionCardComponent {
  @Input() title: string;
  @Input() description: string;
  @Output() showMore: EventEmitter<any> = new EventEmitter();
  constructor() {}
}
