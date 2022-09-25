import { HIRING_REPORT_TYPE } from './reports/hiring-report-type.config';
import { HIRING_SURVEY_TYPE } from './reports/hiring-survey-type.config';
import { DEVELOPMENT_SURVEY_TYPE } from './reports/development-survey-type.config';
import { HIRING_CANDIDATE_REVIEW } from './reports/hiring-candidate-review.config';
import { DEVELOPMENT_REPORT_TYPE } from './reports/development-report-type.config';
import { DEVELOPMENT_CANDIDATE_REVIEW } from './reports/development-candidate-review.config';
export const listScreenByReport: ConfigurationTypesReports[] = [
  HIRING_SURVEY_TYPE,
  HIRING_REPORT_TYPE,
  HIRING_CANDIDATE_REVIEW,
  DEVELOPMENT_SURVEY_TYPE,
  DEVELOPMENT_REPORT_TYPE,
  DEVELOPMENT_CANDIDATE_REVIEW,
];

export interface ConfigurationTypesReports {
  groupReport: string;
  reportType: string;
  screens: Screen[];
}

export interface Screen {
  block: number;
  sections: Section[];
}

export interface Section {
  column: number;
  items: string[];
}
