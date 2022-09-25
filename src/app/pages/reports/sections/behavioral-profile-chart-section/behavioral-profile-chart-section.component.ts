import { Component, Input, OnInit } from '@angular/core';
import { BehavioralProfileChart } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { REPNA } from '../../../../core/models/repna.model';

@Component({
  selector: 'app-behavioral-profile-chart-section',
  templateUrl: './behavioral-profile-chart-section.component.html',
  styleUrls: ['./behavioral-profile-chart-section.component.scss'],
})
export class BehavioralProfileChartSectionComponent implements OnInit {
  @Input() behavioralProfileInfo!: BehavioralProfileChart;

  //Bindings
  energyValue: number;
  energyChartValue: number;
  decisionMakingValue: number;
  profileIntensityValue: number;

  arrayTableN: any[];
  arrayTableR: any[];

  naturalREPNA: REPNA;
  roleREPNA: REPNA;

  titleArray = [null, 'R', 'E', 'P', 'N', 'A'];
  naturalSelected: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.arrayTableN = [
      this.titleArray,
      this.getProfileRow(true),
      this.getWordsCountRow(true),
      this.getAxisIntensityRow(true),
    ];

    this.arrayTableR = [
      this.titleArray,
      this.getProfileRow(false),
      this.getWordsCountRow(false),
      this.getAxisIntensityRow(false),
    ];

    this.setNaturalSelected(true);
    this.energyValue = this.getEnergyValue();

    this.naturalREPNA = this.getREPNA(true);
    this.roleREPNA = this.getREPNA(false);
  }

  setNaturalSelected(natural: boolean): void {
    this.naturalSelected = natural;
    this.energyValue = this.getEnergyValue();
    this.decisionMakingValue = this.getDecisionMaking();
    this.profileIntensityValue = this.getProfileIntensity();
    this.energyChartValue = this.getEnergyChartValue();
  }

  getREPNA(natural: boolean): REPNA {
    if (natural) {
      return {
        rName: 'R',
        eName: 'E',
        pName: 'P',
        nName: 'N',
        aName: 'A',
        rValue:
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalRiskAxisValue,
        eValue:
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalExtroversionAxisValue,
        pValue:
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalPatienceAxisValue,
        nValue:
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalConformityNormsAxisValue,
        aValue:
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalSelfControlAxisValue,
        mediaValue:
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalAverage,
      };
    }

    return {
      rName: 'R',
      eName: 'E',
      pName: 'P',
      nName: 'N',
      aName: 'A',
      rValue:
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .roleRiskAxisValue,
      eValue:
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .roleExtroversionAxisValue,
      pValue:
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .rolePatienceAxisValue,
      nValue:
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .roleConformityNormsAxisValue,
      aValue:
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .roleSelfControlAxisValue,
      mediaValue:
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .roleAverage,
    };
  }

  getEnergyValue(): number {
    return Number(
      (this.naturalSelected
        ? this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalEnergy
        : this.behavioralProfileInfo.behavioralProfileChartInformation
            .roleEnergy) * 100
    );
  }

  getEnergyChartValue(): number {
    return Number(
      this.naturalSelected
        ? this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalEnergyChartValue
        : this.behavioralProfileInfo.behavioralProfileChartInformation
            .roleEnergyChartValue
    );
  }

  getDecisionMaking(): number {
    return Number(
      (this.naturalSelected
        ? this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalDecisionMaking
        : this.behavioralProfileInfo.behavioralProfileChartInformation
            .roleDecisionMaking) * 100
    );
  }
  getProfileIntensity(): number {
    return Number(
      (this.naturalSelected
        ? this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalProfileIntensity
        : this.behavioralProfileInfo.behavioralProfileChartInformation
            .roleProfileIntensity) * 100
    );
  }

  getProfileRow(natural: boolean): string[] {
    if (natural) {
      return [
        'Perfil',
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalRiskAxisValue.toString(),
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalExtroversionAxisValue.toString(),
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalPatienceAxisValue.toString(),
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalConformityNormsAxisValue.toString(),
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalSelfControlAxisValue.toString(),
      ];
    }

    return [
      'Perfil',
      this.behavioralProfileInfo.behavioralProfileChartInformation.roleRiskAxisValue.toString(),
      this.behavioralProfileInfo.behavioralProfileChartInformation.roleExtroversionAxisValue.toString(),
      this.behavioralProfileInfo.behavioralProfileChartInformation.rolePatienceAxisValue.toString(),
      this.behavioralProfileInfo.behavioralProfileChartInformation.roleConformityNormsAxisValue.toString(),
      this.behavioralProfileInfo.behavioralProfileChartInformation.roleSelfControlAxisValue.toString(),
    ];
  }

  getWordsCountRow(natural: boolean): string[] {
    if (natural) {
      return [
        '#',
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalRiskWordsNumber.toString(),
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalExtroversionWordsNumber.toString(),
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalPatienceWordsNumber.toString(),
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalConformityNormsWordsNumber.toString(),
        this.behavioralProfileInfo.behavioralProfileChartInformation.naturalSelfControlWordsNumber.toString(),
      ];
    }

    return [
      '#',
      this.behavioralProfileInfo.behavioralProfileChartInformation.roleRiskWordsNumber.toString(),
      this.behavioralProfileInfo.behavioralProfileChartInformation.roleExtroversionWordsNumber.toString(),
      this.behavioralProfileInfo.behavioralProfileChartInformation.rolePatienceWordsNumber.toString(),
      this.behavioralProfileInfo.behavioralProfileChartInformation.roleConformityNormsWordsNumber.toString(),
      this.behavioralProfileInfo.behavioralProfileChartInformation.roleSelfControlWordsNumber.toString(),
    ];
  }

  getAxisIntensityRow(natural: boolean): string[] {
    if (natural) {
      return [
        'IE',
        (
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalRiskAxisIntensity * 100
        ).toString(),
        (
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalExtroversionAxisIntensity * 100
        ).toString(),
        (
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalPatienceAxisIntensity * 100
        ).toString(),
        (
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalConformityNormsAxisIntensity * 100
        ).toString(),
        (
          this.behavioralProfileInfo.behavioralProfileChartInformation
            .naturalSelfControlAxisIntensity * 100
        ).toString(),
      ];
    }

    return [
      'IE',
      (
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .roleRiskAxisIntensity * 100
      ).toString(),
      (
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .roleExtroversionAxisIntensity * 100
      ).toString(),
      (
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .rolePatienceAxisIntensity * 100
      ).toString(),
      (
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .roleConformityNormsAxisIntensity * 100
      ).toString(),
      (
        this.behavioralProfileInfo.behavioralProfileChartInformation
          .roleSelfControlAxisIntensity * 100
      ).toString(),
    ];
  }
}
