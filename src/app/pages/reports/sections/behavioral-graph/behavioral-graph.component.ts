import { Job } from '../../../../core/services/microservices/job/job.interface';
import {
  BehavioralRadarChartIndividual,
  JobCompatibility,
  PDAIndividualSectionsResponse,
} from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import {
  BehavioralRadarChartCompetenciesCompatibility,
  BehavioralRadarChartGroup,
  BehavioralRadarChartGroupAverage,
  Competency,
} from '../../../../core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehavioralGraphService } from './behavioral-graph.service';
import { Subscription } from 'rxjs';
import { PDAIndividualSectionsRequest } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsRequest.interface';
import { unsubscribe } from '../../../../core/utils/subscription.util';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';

@Component({
  selector: 'app-behavioral-graph',
  templateUrl: './behavioral-graph.component.html',
  styleUrls: ['./behavioral-graph.component.scss'],
})
export class BehavioralGraphComponent implements OnInit, OnDestroy {
  //Variables
  private _jobCompatibility: JobCompatibility;

  puesto: boolean = true;
  lider: boolean = false;
  equipo: boolean = false;

  //bindings
  naturalSelected: boolean;
  selectedTab: number = 0;
  jobSelected: Job;
  behavioralRadarChartCompetenciesCompatibilityByLeader: BehavioralRadarChartCompetenciesCompatibility[];
  behavioralRadarChartGroupAverageByTeam: Competency[];
  //Inputs
  @Input() reportGeneratedId: string;
  @Input() reportJobId: string;
  @Input() behavioralRadarChart!: BehavioralRadarChartIndividual;
  @Input() leaderIndividualId: string;
  @Input() behavioralRadarChartGroup: BehavioralRadarChartGroup;
  @Input() behavioralRadarChartGroupAverage: BehavioralRadarChartGroupAverage;
  @Input() set jobCompatibility(jobCompatibility: JobCompatibility) {
    this._jobCompatibility = jobCompatibility;
  }
  @Input() jobs: Job[];

  //Subscriptions
  behavioraGraphSub: Subscription;

  constructor(
    private behavioraGraphService: BehavioralGraphService //private storeService: StoreService
  ) {}

  ngOnInit(): void {
    if (this.behavioralRadarChartGroup) {
      this.setCompetenciesCompatibilityByLeader();
      this.setCompetenciesCompatibilityTeamByGroup();
    }
    this.naturalSelected = true;
    this.setJobSelected();
  }

  ngOnDestroy(): void {
    unsubscribe(this.behavioraGraphSub);
  }

  setCompetenciesCompatibilityByLeader(): void {
    this.behavioralRadarChartCompetenciesCompatibilityByLeader =
      this.behavioralRadarChartGroup.behavioralRadarChartCompetenciesCompatibility.filter(
        data => data.individualId === this.leaderIndividualId
      );
  }

  setCompetenciesCompatibilityTeamByGroup(): void {
    this.behavioralRadarChartGroupAverageByTeam =
      this.behavioralRadarChartGroupAverage.behavioralAxiCompetencies;
  }

  setJobSelected(): void {
    if (!this.jobs) {
      return;
    }
    this.selectedTab = 1;
    this.jobSelected = this.jobs?.find(job => {
      return this.reportJobId === job.jobId;
    });
    this.onChangeJob(this.jobSelected);
  }
  onChangeJob(newJob: Job): void {
    this.getCorrelationJobBehavioralCompetencies(newJob);
  }

  getCorrelationJobBehavioralCompetencies(newJob: Job): void {
    this.jobSelected = newJob;

    let baseRequest = this.getBodyRequest(
      this.reportGeneratedId,
      [this.jobSelected.jobId],
      ['JobCompatibility']
    );

    this.behavioraGraphSub = this.behavioraGraphService
      .getCorrelationJobBehavioralCompetencies(baseRequest)
      .subscribe((res: PDAIndividualSectionsResponse) => {
        this.jobCompatibility = res.jobCompatibility;
      });
  }

  getBodyRequest(
    reportgeneratedId: string,
    jobsId: string[],
    listSectionsPDA: string[]
  ): PDAIndividualSectionsRequest {
    return {
      reportGeneratedId: reportgeneratedId,
      sectionsReportPDA: listSectionsPDA,
      jobParameters: {
        jobsId,
        natural: this.naturalSelected,
        includeAverage: false,
        includeCorrelationCompetency: true,
      },
      includeGraphics: false,
    };
  }

  selectType(natural: boolean): void {
    if (this.naturalSelected === natural) {
      return;
    }
    this.naturalSelected = natural;
  }

  get jobCompatibility(): JobCompatibility {
    return this._jobCompatibility;
  }

  formatText(text: string): string {
    return getDottedFirstCharacters(text, 38);
  }
}
