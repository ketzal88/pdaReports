import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  Job,
  JobCategory,
} from 'src/app/core/services/microservices/job/job.interface';
import { StepModel } from '../../../../core/models/step.model';
import { JobService } from '../../../../core/services/microservices/job/job.service';
import { GetJobsResponse } from '../../../../core/services/microservices/job/job.interface';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import { PopUpMessage } from 'src/app/shared/components/display-message/displayMessage.interface';
import { StoreService } from '../../../../core/services/store.service';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { Subscription } from 'rxjs/internal/Subscription';
import { LanguageService } from '../../../../core/services/language.service';
import { StateLanguage } from '../../../../core/consts/state-language.enum';
import { GeneratedReportByIdResponse } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { Loader } from '../../../../core/services/loader/loader';

@Component({
  selector: 'app-select-jobs',
  templateUrl: './select-jobs.component.html',
  styleUrls: ['./select-jobs.component.scss'],
})
export class SelectJobsComponent implements OnInit {
  //Variables
  jobCategorySelectedStore: JobCategory;
  jobSelectedStore: Job;
  stateLanguage: string;
  jobCategoryId: string;

  //Bindings
  jobSelected: Job;
  jobCategorySelected?: JobCategory;
  jobsList: Job[];
  jobCategoryDataSource: JobCategory[] = null;

  //Inputs
  @Input() step!: StepModel;
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId: string;
  @Input() generatedReportByIdResponse: GeneratedReportByIdResponse;

  //Outputs
  @Output() selectedJobEvent = new EventEmitter<Job>();
  @Output() selectedJobsByCategoryEvent = new EventEmitter<Job[]>();
  @Output() selectedJobCategoryEvent = new EventEmitter<JobCategory>();

  //Loaders
  categoryByJobLoader: Loader;
  jobCategoriesLoader: Loader;

  //Subscriptions
  languageServiceSub: Subscription;
  categoryByJobSub: Subscription;
  jobCategoriesSub: Subscription;

  constructor(
    private jobService: JobService,
    private displayMessageService: DisplayMessageService,
    private storeService: StoreService,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.initLoaders();
    this.listenLanguageChangeEvent();
    this.jobsList = [];

    this.jobCategorySelected = this.storeService.getData(
      StoreKeys.SELECTED_JOB_CATEGORY
    );

    this.jobSelectedStore = this.storeService.getData(StoreKeys.SELECTED_JOB);

    if (!this.jobCategorySelected || !this.jobSelectedStore) {
      if (
        this.generatedReportByIdResponse &&
        this.generatedReportByIdResponse.reportGeneratedJobs &&
        this.generatedReportByIdResponse.reportGeneratedJobs.length > 0
      ) {
        this.loadJobByGeneratedReport();
      } else {
        this.getJobCategories(true, null);
      }
    }

    this.onCompleteStep();
    this.getJobCategories(true, null);
  }

  initLoaders(): void {
    this.categoryByJobLoader = new Loader();
    this.jobCategoriesLoader = new Loader();
  }

  loadJobByGeneratedReport(): void {
    this.categoryByJobSub = this.categoryByJobLoader
      .load(
        this.jobService.getJobs(
          this.generatedReportByIdResponse.reportGeneratedJobs[0].jobId,
          null,
          null,
          null,
          null,
          1,
          2
        )
      )
      .subscribe({
        next: (res: GetJobsResponse) => {
          this.jobCategoryId = res.data[0].jobCategoryId;
          this.jobSelected = res.data[0];
          this.getJobCategories(true, this.jobCategoryId);
        },
        error: err => {
          console.log('No se pudo obtener informacion del puesto generado');
        },
      });
  }

  listenLanguageChangeEvent(): void {
    //Se subscribe para escuchar el evento y tomar alguna accion
    this.languageServiceSub = this.languageService
      .getCurrentStateLanguage()
      .subscribe(stateLanguage => {
        this.stateLanguage = stateLanguage;
        if (this.stateLanguage === StateLanguage.CHANGING) {
          this.getJobCategories(true, this.jobCategoryId);
        }
      });
  }

  onCompleteStep(): void {
    if (this.step) {
      this.step.isComplete = true;
    }
  }

  onFilterInput(event: string): void {
    this.getJobs(
      this.jobCategorySelected ? this.jobCategorySelected.jobCategoryId : null,
      event.trim()
    );
  }

  onChangeCategory(jobCategorySelected: JobCategory): void {
    this.jobCategorySelected = jobCategorySelected;
    this.getJobs(jobCategorySelected.jobCategoryId);
  }

  isJobSelected(jobChecked: Job): boolean {
    return (
      this.jobSelected?.jobId === jobChecked.jobId ||
      this.jobSelectedStore?.jobId === jobChecked.jobId
    );
  }

  isCategorySelected(jobCategorySelection: JobCategory): boolean {
    return (
      this.jobCategorySelected?.jobCategoryId ===
      jobCategorySelection.jobCategoryId
    );
  }

  selectJob(jobSelected: Job): void {
    if (jobSelected) {
      this.jobSelected = jobSelected;

      this.selectedJobEvent.emit(this.jobSelected);
      this.storeService.setData(StoreKeys.SELECTED_JOB, jobSelected);
      this.selectedJobsByCategoryEvent.emit(this.jobsList);
      this.selectedJobCategoryEvent.emit(this.jobCategorySelected);
      this.storeService.setData(
        StoreKeys.SELECTED_JOB_CATEGORY,
        this.jobCategorySelected
      );
      this.onCompleteStep();
    }
  }

  //Data
  getJobCategories(includeCustomized: boolean = true, category: string): void {
    const subsJobCategories = this.jobService
      .getJobCategories(includeCustomized)
      .subscribe({
        next: (response: JobCategory[]) => {
          this.jobCategoryDataSource = response;

          if (
            this.generatedReportByIdResponse &&
            this.generatedReportByIdResponse.reportGeneratedJobs &&
            this.generatedReportByIdResponse.reportGeneratedJobs.length > 0
          ) {
            this.jobCategorySelected = response.find(item => {
              return item.jobCategoryId === category;
            });
            this.getJobs(this.jobCategorySelected.jobCategoryId);
            this.selectJob(this.jobSelected);
          } else {
            if (this.jobCategorySelected) {
              this.getJobs(this.jobCategorySelected.jobCategoryId);
            }
          }
        },
        error: err => {},
        complete: () => {
          subsJobCategories.unsubscribe();
        },
      });
  }
  getJobs(categoryId?: string, name?: string): void {
    const subsJobs = this.jobService
      .getJobs(null, name, null, null, categoryId, 1, 70)
      .subscribe({
        next: (response: GetJobsResponse) => {
          this.jobsList = response.data;
        },
        error: err => {},
        complete: () => {
          subsJobs.unsubscribe();
        },
      });
  }
  openJobPopUp(): void {
    const message = new PopUpMessage('');
    message.imageUrl = '/assets/img/report-central/PopUp_Jobs.svg';
    this.displayMessageService.openPopUp(message);
  }
}
