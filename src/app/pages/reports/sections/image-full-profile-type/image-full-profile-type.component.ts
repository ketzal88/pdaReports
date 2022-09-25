import { Component, Input, OnInit } from '@angular/core';
import {
  BehavioralDescriptors,
  CoverIndividual,
} from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-image-full-profile-type',
  templateUrl: './image-full-profile-type.component.html',
  styleUrls: ['./image-full-profile-type.component.scss'],
})
export class ImageFullProfileTypeComponent implements OnInit {
  @Input() coverIndividual: CoverIndividual;

  @Input() behavioralDescriptors: BehavioralDescriptors;

  constructor() {}

  ngOnInit(): void {}
}
