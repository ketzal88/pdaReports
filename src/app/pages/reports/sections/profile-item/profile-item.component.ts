import { Component, Input, OnInit } from '@angular/core';
// import { CoverIndividual } from '../../interfaces/pdaIndividualSectionsResponse.interface';
import { CoverIndividual } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-profile-item',
  templateUrl: './profile-item.component.html',
  styleUrls: ['./profile-item.component.scss'],
})
export class ProfileItemComponent implements OnInit {
  @Input() coverIndividual!: CoverIndividual;

  constructor() {}

  ngOnInit(): void {}
}
