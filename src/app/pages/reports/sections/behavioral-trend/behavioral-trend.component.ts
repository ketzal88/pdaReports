import {
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TypeBehavioral } from './interfaces/type-behavioral.interface';
import {
  IndividualInformation,
  RepnsTrends,
} from '../../../../core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';
import { getDottedFirstCharacters } from 'src/app/core/utils/strings.util';

@Component({
  selector: 'app-behavioral-trend',
  templateUrl: './behavioral-trend.component.html',
  styleUrls: ['./behavioral-trend.component.scss'],
})
export class BehavioralTrendComponent implements OnInit {
  @Input() repnsTrends: RepnsTrends;
  @Input() selectedId: string;
  @ViewChildren('panelTitle') titles: QueryList<ElementRef>;

  //Bindings
  idxSelected: number;
  listBehavioralViews: number[];

  //Variables
  individualInformation: IndividualInformation[];
  typeBehavioral: TypeBehavioral[];
  colors: string[] = ['#ff6819', '#FFD100', '#27ACF7', '#2FB039', '#8C24D2'];

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    if (this.repnsTrends) {
      this.listBehavioralViews = [];
      this.individualInformation = this.repnsTrends.individualInformation;

      let listType: string[] = ['r', 'e', 'p', 'n', 's'];

      this.typeBehavioral = [];
      for (let i = 0; i < listType.length; i++) {
        let newTypeBehavioral: TypeBehavioral = {
          type: listType[i],
          name: this.translateService.instant(
            `REPORTS.SECTIONS.BEHAVIORAL_TREND.TYPES.${listType[i]}`
          ),
          tooltip: this.translateService.instant(
            `REPORTS.SECTIONS.BEHAVIORAL_TREND.TOOLTIP.${listType[i]}_DESCRIPTION`
          ),
          data: [],
        };
        this.typeBehavioral.push(newTypeBehavioral);
      }
      this.individualInformation;
      for (let i = 0; i < this.individualInformation.length; i++) {
        let data: any = {};
        data.r = this.individualInformation[i].r;
        data.e = this.individualInformation[i].e;
        data.p = this.individualInformation[i].p;
        data.n = this.individualInformation[i].n;
        data.s = this.individualInformation[i].s;

        let typeBehavioral: any = {};
        typeBehavioral.data = [];
        for (let j = 0; j < this.typeBehavioral.length; j++) {
          let dato: any = {};
          dato.individualId = this.individualInformation[i].individualId;
          dato.shortName = this.individualInformation[i].individualShortName;
          dato.name = this.individualInformation[i].individualName;
          (dato.selected =
            this.individualInformation[i].individualId === this.selectedId
              ? true
              : false),
            (dato.value = parseInt(
              this.individualInformation[i][this.typeBehavioral[j].type]
            ));
          this.typeBehavioral[j].data = [...this.typeBehavioral[j].data, dato];
        }
      }
    }
  }

  getValue(value: number): string {
    let diff = 570; //Diferencia entre el tamaño de la esfera(15px) y el tamaño del contenedor(en este caso 600px)

    let newValue = ((value * diff) / 100 - 570).toFixed(2);
    return newValue;
  }

  changeExpandedBehavioral(item: any, idx: number): void {
    this.idxSelected = idx;
  }

  changeClose(idx: number): void {
    if (idx === this.idxSelected) {
      this.idxSelected = undefined;
    }
  }

  getDottedFirstCharacters = getDottedFirstCharacters;
  changeBehavioralTrend(idx: number): void {
    this.idxSelected = idx;
  }
}
