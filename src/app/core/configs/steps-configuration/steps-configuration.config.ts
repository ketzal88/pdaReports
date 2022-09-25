import { SELECT_STYLE_STEP } from './select-style-step.config';
import { SELECT_JOBS_STEP } from './select-jobs-step.config';
import { SELECT_INDIVIDUALS_STEP } from './select-individuals-step.config';
import { SELECT_GROUP_STEP } from './select-group-step.config';
import { SELECT_COMPETENCIES_STEP } from './select-competencies-step.config';
import { StepConfiguration } from './interfaces/steps-configuration.interface';
import { SELECT_AREA_LEADER_STEP } from './select-area-leader-step.config';
import { SELECT_HR_FEEDBACK_STEP } from './select-hr-feedback-step.config';

const DEVELOPMENT_SURVEY_TYPE_CONFIG: StepConfiguration = {
  groupReport: 'DEVELOPMENT',
  reportType: 'DEVELOPMENT_SURVEY',
  steps: [
    SELECT_STYLE_STEP,
    SELECT_INDIVIDUALS_STEP,
    SELECT_GROUP_STEP,
    SELECT_JOBS_STEP,
    SELECT_AREA_LEADER_STEP,
  ],
};

const DEVELOPMENT_REPORT_TYPE_CONFIG: StepConfiguration = {
  groupReport: 'DEVELOPMENT',
  reportType: 'DEVELOPMENT_REPORT',
  steps: [
    SELECT_STYLE_STEP,
    SELECT_INDIVIDUALS_STEP,
    SELECT_COMPETENCIES_STEP,
    SELECT_JOBS_STEP,
    SELECT_AREA_LEADER_STEP,
  ],
};

const DEVELOPMENT_REVIEW_TYPE_CONFIG: StepConfiguration = {
  groupReport: 'DEVELOPMENT',
  reportType: 'DEVELOPMENT_CANDIDATE_REVIEW',
  steps: [
    SELECT_STYLE_STEP,
    SELECT_INDIVIDUALS_STEP,
    SELECT_COMPETENCIES_STEP,
    SELECT_HR_FEEDBACK_STEP,
  ],
};

const HIRING_SURVEY_TYPE_CONFIG: StepConfiguration = {
  groupReport: 'HIRING',
  reportType: 'HIRING_SURVEY',
  steps: [
    SELECT_STYLE_STEP,
    SELECT_INDIVIDUALS_STEP,
    SELECT_COMPETENCIES_STEP,
    SELECT_JOBS_STEP,
    SELECT_AREA_LEADER_STEP,
    SELECT_GROUP_STEP,
  ],
};

const HIRING_REPORT_TYPE_CONFIG: StepConfiguration = {
  groupReport: 'HIRING',
  reportType: 'HIRING_REPORT',
  steps: [
    SELECT_STYLE_STEP,
    SELECT_INDIVIDUALS_STEP,
    SELECT_COMPETENCIES_STEP,
    SELECT_JOBS_STEP,
    SELECT_AREA_LEADER_STEP,
    SELECT_GROUP_STEP,
  ],
};

const HIRING_CANDIDATE_REVIEW_TYPE_CONFIG: StepConfiguration = {
  groupReport: 'HIRING',
  reportType: 'HIRING_CANDIDATE_REVIEW',
  steps: [
    SELECT_STYLE_STEP,
    SELECT_INDIVIDUALS_STEP,
    SELECT_COMPETENCIES_STEP,
    SELECT_HR_FEEDBACK_STEP,
  ],
};
export const configurationSteps: StepConfiguration[] = [
  DEVELOPMENT_SURVEY_TYPE_CONFIG,
  DEVELOPMENT_REPORT_TYPE_CONFIG,
  DEVELOPMENT_REVIEW_TYPE_CONFIG,

  HIRING_SURVEY_TYPE_CONFIG,
  HIRING_REPORT_TYPE_CONFIG,
  HIRING_CANDIDATE_REVIEW_TYPE_CONFIG,
];
