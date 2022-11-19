import { Component, Input, OnInit } from '@angular/core';
import { ProfileTypes } from '../../../../core/configs/profile/profile-types.enum';
import {
  BehavioralDescriptors,
  CoverIndividual,
} from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-image-profile-type',
  templateUrl: './image-profile-type.component.html',
  styleUrls: ['./image-profile-type.component.scss'],
})
export class ImageProfileTypeComponent implements OnInit {
  //Bindinds
  ProfileTypes = ProfileTypes;

  private bottom: number;

  @Input() coverIndividual: CoverIndividual;

  @Input() behavioralDescriptors: BehavioralDescriptors;

  constructor() {}

  ngOnInit(): void {
    this.bottom = 26;
  }

  getBottom(): string {
    this.bottom += 6;
    return this.bottom.toString();
  }
}
