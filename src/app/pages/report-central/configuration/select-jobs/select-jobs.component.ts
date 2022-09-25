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

@Component({
  selector: 'app-select-jobs',
  templateUrl: './select-jobs.component.html',
  styleUrls: ['./select-jobs.component.scss'],
})
export class SelectJobsComponent implements OnInit {
  //Variables
  jobCategorySelectedStore: JobCategory;
  jobSelectedStore: Job;

  //Bindings
  jobSelected: Job;
  jobCategorySelected?: JobCategory;
  jobsList: Job[];
  jobCategoryDataSource: JobCategory[] = null;

  //Inputs
  @Input() step!: StepModel;
  @Input() selectedClientId: string;
  @Input() selectedSubbaseId: string;

  //Outputs
  @Output() selectedJobEvent = new EventEmitter<Job>();
  @Output() selectedJobsByCategoryEvent = new EventEmitter<Job[]>();
  @Output() selectedJobCategoryEvent = new EventEmitter<JobCategory>();

  constructor(
    private jobService: JobService,
    private displayMessageService: DisplayMessageService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.jobsList = [];
    this.jobCategorySelectedStore = this.storeService.getData(
      StoreKeys.SELECTED_JOB_CATEGORY
    );
    this.jobSelectedStore = this.storeService.getData(StoreKeys.SELECTED_JOB);
    this.getJobCategories(true);
  }

  onCompleteStep(): void {
    if (this.step) {
      this.step.isComplete = true;
    }
  }

  onFilterInput(event: string): void {
    this.getJobs(null, event.trim());
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
        jobCategorySelection.jobCategoryId ||
      this.jobCategorySelectedStore?.jobCategoryId ===
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
  getJobCategories(includeCustomized: boolean = true): void {
    const subsJobCategories = this.jobService
      .getJobCategories(includeCustomized)
      .subscribe({
        next: (response: JobCategory[]) => {
          this.jobCategoryDataSource = response;
          if (this.jobCategorySelectedStore) {
            this.onChangeCategory(this.jobCategorySelectedStore);
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
