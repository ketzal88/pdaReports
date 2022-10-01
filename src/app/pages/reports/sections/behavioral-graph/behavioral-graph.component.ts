import { Job } from '../../../../core/services/microservices/job/job.interface';
import {
  BehavioralRadarChart,
  JobCompatibility,
  PDAIndividualSectionsResponse,
} from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { BehavioralGraphService } from './behavioral-graph.service';
import { Subscription } from 'rxjs';
import { StoreService } from '../../../../core/services/store.service';
import { MyReport } from '../../../report-central/configuration/interfaces/myReport.interface';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { PDAIndividualSectionsRequest } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsRequest.interface';
import { unsubscribe } from '../../../../core/utils/subscription.util';
import { SelectedReport } from '../../../../core/models/reportType.model';

@Component({
  selector: 'app-behavioral-graph',
  templateUrl: './behavioral-graph.component.html',
  styleUrls: ['./behavioral-graph.component.scss'],
})
export class BehavioralGraphComponent implements OnInit, OnDestroy {
  //Variables
  private _jobCompatibility: JobCompatibility;
  private requestReportData!: MyReport;
  private selectedReport: SelectedReport = null;
  
  puesto: boolean = true;
  lider: boolean = false;
  equipo: boolean = false;

  //bindings
  naturalSelected: boolean;
  selectedTab: number = 1;
  jobSelected: Job;

  //Inputs
  @Input() reportId: string;
  @Input() myReport: MyReport;
  @Input() behavioralRadarChart!: BehavioralRadarChart;
  @Input() jobCompatibility: JobCompatibility;
  @Input() jobs: Job[];

  //Subscriptions
  behavioraGraphSub: Subscription;

  constructor(
    private behavioraGraphService: BehavioralGraphService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.naturalSelected = true;
    this.loadReportType();
    this.loadReportData();
    this.setJobSelected();
  }

  ngOnDestroy(): void {
    unsubscribe(this.behavioraGraphSub);
  }

  loadReportType(): void {
    let typeReport = this.storeService.getData(StoreKeys.TYPE_REPORT);
    this.selectedReport = typeReport ? JSON.parse(typeReport) : null;
  }

  loadReportData(): void {
    let reportData = this.storeService.getData(StoreKeys.REPORT);
    this.requestReportData = reportData ? JSON.parse(reportData) : null;
  }
  setJobSelected(): void {
    this.jobSelected = this.jobs?.find(job => {
      return this.myReport.jobId === job.jobId;
    });
  }
  
  onChangeJob(newJob: Job): void {
    this.getCorrelationJobBehavioralCompetencies(newJob);
  }

  getCorrelationJobBehavioralCompetencies(newJob: Job): void {
    this.jobSelected = newJob;

    let baseRequest = this.getBodyRequest(
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
    jobsId: string[],
    listSectionsPDA: string[]
  ): PDAIndividualSectionsRequest {
    return {
      reportId: this.reportId,
      baseId: this.myReport.baseId,
      subbaseId: this.myReport.subBaseId,
      individualId: this.myReport.individualIds[0],
      sectionsReportPDA: listSectionsPDA,
      jobParameters: {
        jobsId,
        natural: this.naturalSelected,
        includeAverage: false,
        includeCorrelationCompetency: true,
      },
      competencyParameters: {
        competenciesId: [],
        natural: true,
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
}
