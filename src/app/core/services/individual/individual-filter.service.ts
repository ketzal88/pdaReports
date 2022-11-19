import { EventEmitter, Injectable } from '@angular/core';
import { TypeFilterItem } from 'src/app/shared/components/mat-custom-individuals-table/models/type-filter-item.interface';
import { TypeFilter } from 'src/app/shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { GenderResponse } from '../microservices/individual/gender.interface';
import { GenderService } from '../microservices/individual/gender.service';
import { Consistency } from '../microservices/individual/individual.interface';

@Injectable()
export class IndividualFilterService {
  typeFilterList: TypeFilter[] = [];
  typeFilterListEvent: EventEmitter<TypeFilter[]> = new EventEmitter();

  constructor(private genderService: GenderService) {
    this.loadStateConsistencyFilter();
  }

  loadGenderFilter(clientId: string): void {
    this.genderService.getGenders(clientId).subscribe({
      next: (data: GenderResponse[]) => {
        //TODO: Revisar filtro si es necesario
        let genders = data.filter(gender => {
          return [0, 1, 2].includes(gender.idGender);
        });

        const GenderFilters: TypeFilterItem[] = genders.map(
          (gender: GenderResponse) => ({
            key: gender.idGender.toString(),
            name: gender.genderText,
          })
        );
        let idxGender = this.typeFilterList.findIndex(
          data => data.key === 'Gender'
        );
        if (idxGender > -1) {
          this.typeFilterList[idxGender].data = [...GenderFilters];
        } else {
          this.typeFilterList.unshift({
            key: 'Gender',
            name: 'Genero',
            data: GenderFilters,
          });
        }
        this.typeFilterListEvent.emit(this.typeFilterList);
      },
      error: err => {},
    });
  }

  private loadStateConsistencyFilter(): void {
    const ConsistencyFilters: TypeFilterItem[] = Object.keys(Consistency)
      .filter(k => typeof Consistency[k] === 'string')
      .map(filter => ({ key: filter, name: Consistency[filter] }));
    this.typeFilterList.push({
      key: 'Consistency',
      name: 'Estado del assesment',
      data: ConsistencyFilters,
    });
    this.typeFilterListEvent.emit(this.typeFilterList);
  }
}
