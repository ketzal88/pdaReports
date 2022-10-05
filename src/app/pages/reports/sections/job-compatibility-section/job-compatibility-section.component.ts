import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { JobCompatibility } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { StoreService } from 'src/app/core/services/store.service';
import { Job } from '../../../../core/services/microservices/job/job.interface';
import { MyReport } from '../../../report-central/configuration/interfaces/myReport.interface';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { JobCompatibilitySectionService } from './job-compatibility-section.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { PDAIndividualSectionsResponse } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { PDAIndividualSectionsRequest } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsRequest.interface';
import { unsubscribe } from '../../../../core/utils/subscription.util';
import { SelectedReport } from '../../../../core/models/reportType.model';
import { getDottedFirstCharacters } from 'src/app/core/utils/strings.util';

@Component({
  selector: 'app-job-compatibility-section',
  templateUrl: './job-compatibility-section.component.html',
  styleUrls: ['./job-compatibility-section.component.scss'],
})
export class JobCompatibilitySectionComponent implements OnInit, OnDestroy {
  //Variables
  private _jobCompatibility!: JobCompatibility;
  private requestReportData!: MyReport;
  private selectedReport: SelectedReport = null;

  //Bindings
  jobSelected: Job;

  isNatural: boolean;

  //Inputs
  @Input() reportId: string;
  @Input() myReport: MyReport;
  @Input() jobs: Job[];
  @Input() set jobCompatibility(jobCompatibility: JobCompatibility) {
    this._jobCompatibility = jobCompatibility;
  }

  //Subscriptions
  jobCompatibilitySectionSub: Subscription;

  constructor(
    private storeService: StoreService,
    private jobCompatibilitySectionService: JobCompatibilitySectionService
  ) {}

  ngOnInit(): void {
    console.log('ngOnInit - subasa');
    this.isNatural = true;
    this.loadReportType();
    this.loadReportData();
    //TODO - Back: Solicitar que agreguen el campo jobId en jobCompatibility
    //La comparacion esta puesta por nombre del titulo
    this.jobSelected = this.jobs?.find(job => {
      return this.myReport.jobId === job.jobId;
    });
    console.log('jobSelected: ', this.jobSelected);
  }

  ngOnDestroy(): void {
    unsubscribe(this.jobCompatibilitySectionSub);
  }

  loadReportType(): void {
    let typeReport = this.storeService.getData(StoreKeys.TYPE_REPORT);
    this.selectedReport = typeReport ? JSON.parse(typeReport) : null;
  }

  loadReportData(): void {
    let reportData = this.storeService.getData(StoreKeys.REPORT);
    this.requestReportData = reportData ? JSON.parse(reportData) : null;
  }

  onChangeJob(newJob: Job): void {
    this.jobSelected = newJob;

    let baseRequest = this.getBodyRequest(
      [this.jobSelected.jobId],
      ['JobCompatibility']
    );

    this.jobCompatibilitySectionSub = this.jobCompatibilitySectionService
      .getJobCompatibility(baseRequest)
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
        natural: this.isNatural,
        includeAverage: false,
        includeCorrelationCompetency: false,
      },
      competencyParameters: {
        competenciesId: [],
        natural: true,
      },
      includeGraphics: false,
    };
  }

  get jobCompatibility(): JobCompatibility {
    return this._jobCompatibility;
  }
  
  formatText(text: string) {
    return getDottedFirstCharacters(text, 38);
  }
}
