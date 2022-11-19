import { Component, Input, OnInit } from '@angular/core';
import {
  AgeGenderRange,
  BalanceAgeGender,
} from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { BalanceAgeGenderLocal } from './interfaces/balance-age-gender-local.interface';

@Component({
  selector: 'app-age-gender-balance',
  templateUrl: './age-gender-balance.component.html',
  styleUrls: ['./age-gender-balance.component.scss'],
})
export class AgeGenderBalanceComponent implements OnInit {
  @Input() balanceAgeGender: BalanceAgeGender;

  balanceLocal: BalanceAgeGenderLocal[] = [];
  constructor() {}

  ngOnInit(): void {
    this.loadMappingInfo();
  }

  loadMappingInfo(): void {
    if (this.balanceAgeGender) {
      const { title, description, ...balanceAgeGenderLocal } =
        this.balanceAgeGender;

      let listBalance: string[] = Object.keys(balanceAgeGenderLocal);
      const genderNames = [
        ...new Set(
          listBalance
            .flatMap(x => balanceAgeGenderLocal[x])
            .map((x: AgeGenderRange) => x.genderName)
        ),
      ];

      for (let i = 0; i < listBalance.length; i++) {
        let item: BalanceAgeGenderLocal = {};
        item.labelAgeGender = listBalance[i];
        item.contentAgeGender = genderNames
          .map(
            x =>
              balanceAgeGenderLocal[listBalance[i]].find(
                (y: AgeGenderRange) => y.genderName === x
              ) ?? { genderName: x, percentage: 0 }
          )
          .map((data: AgeGenderRange) => {
            return {
              gender: '',
              genderName: data.genderName,
              percentage: data.percentage,
            };
          });
        this.balanceLocal.push(item);
      }
    }
  }
}
