import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { JobCompatibility } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { Job } from '../../../../core/services/microservices/job/job.interface';
import { JobCompatibilitySectionService } from './job-compatibility-section.service';
import { Subscription } from 'rxjs/internal/Subscription';
import { PDAIndividualSectionsResponse } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { PDAIndividualSectionsRequest } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsRequest.interface';
import { unsubscribe } from '../../../../core/utils/subscription.util';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';

@Component({
  selector: 'app-job-compatibility-section',
  templateUrl: './job-compatibility-section.component.html',
  styleUrls: ['./job-compatibility-section.component.scss'],
})
export class JobCompatibilitySectionComponent implements OnInit, OnDestroy {
  //Variables
  private _jobCompatibility!: JobCompatibility;

  //Bindings
  jobSelected: Job;

  isNatural: boolean;

  //Inputs
  @Input() reportGeneratedId: string;
  @Input() reportJobId: string;
  @Input() jobs: Job[];
  @Input() set jobCompatibility(jobCompatibility: JobCompatibility) {
    this._jobCompatibility = jobCompatibility;
  }

  //Subscriptions
  jobCompatibilitySectionSub: Subscription;

  constructor(
    private jobCompatibilitySectionService: JobCompatibilitySectionService
  ) {}

  ngOnInit(): void {
    this.isNatural = true;
    //this.loadReportType();
    //this.loadReportData();

    this.jobSelected = this.jobs?.find(job => {
      return this.reportJobId === job.jobId;
    });
  }

  ngOnDestroy(): void {
    unsubscribe(this.jobCompatibilitySectionSub);
  }

  onChangeJob(newJob: Job): void {
    this.jobSelected = newJob;

    let baseRequest = this.getBodyRequest(
      this.reportGeneratedId,
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
    reportGeneratedId: string,
    jobsId: string[],
    listSectionsPDA: string[]
  ): PDAIndividualSectionsRequest {
    return {
      reportGeneratedId: reportGeneratedId,
      sectionsReportPDA: listSectionsPDA,
      jobParameters: {
        jobsId,
        natural: this.isNatural,
        includeAverage: false,
        includeCorrelationCompetency: false,
      },
      includeGraphics: false,
    };
  }

  get jobCompatibility(): JobCompatibility {
    return this._jobCompatibility;
  }

  getDottedFirstCharacters = getDottedFirstCharacters;
}
