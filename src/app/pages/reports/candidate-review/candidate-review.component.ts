import { Component, OnInit } from '@angular/core';
import { PDAGroupSectionsResponse } from 'src/app/core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';
import {
  MultipleJobCompatibility,
  PDAIndividualSectionsResponse,
} from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { TippyService } from 'src/app/core/services/tippy.service';
import individualSections from 'mock-server/src/modules/report-mock/json/individual-sections.json';
import groupSections from 'mock-server/src/modules/report-mock/json/group-sections.json';
import jobs from 'mock-server/src/modules/job-mock/json/jobs.json';
import {
  Job,
  JobCategory,
} from 'src/app/core/services/microservices/job/job.interface';
import {
  GeneratedReport,
  GeneratedReportByIdResponse,
} from 'src/app/core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { NoSectionDataPipe } from 'src/app/shared/pipes/no-section-data.pipe';
import { BehavioralGraphService } from '../sections/behavioral-graph/behavioral-graph.service';
import { JobCompatibilitySectionService } from '../sections/job-compatibility-section/job-compatibility-section.service';
import 'anychart';

@Component({
  selector: 'app-candidate-review',
  templateUrl: './candidate-review.component.html',
  styleUrls: ['./candidate-review.component.scss'],
  providers: [
    TippyService,
    BehavioralGraphService,
    JobCompatibilitySectionService,
    NoSectionDataPipe,
  ],
})
export class CandidateReviewComponent implements OnInit {
  dataIndividualSectionsResponse = individualSections[
    'individual-sections'
  ] as unknown as PDAIndividualSectionsResponse;
  dataGroupSectionsResponse = groupSections[
    'group-sections'
  ] as unknown as PDAGroupSectionsResponse;
  jobsByCategory: Job[] = jobs.jobs.data as unknown as Job[];
  multipleJobCompatibility: MultipleJobCompatibility[];
  jobsIdList: string[];
  jobCategory: JobCategory;
  shortId: string;
  listReportsForEmails: GeneratedReport[];
  generatedReportByIdResponse: GeneratedReportByIdResponse;

  //Report Variables
  reportGeneratedId: string = '801f17a5-13ed-4617-bea2-fa2d777b5418';
  reportJobId: string = 'fef14de2-9663-479f-9002-02d3699c3be1';
  leaderIndividualId = '7b35eec6-e570-4f4b-809d-7de58a552a1b';
  constructor() {}

  ngOnInit(): void {}
}
