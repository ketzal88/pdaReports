import { StepModel } from '../../../models/step.model';
export interface ItemStepConfiguration {
  name: string;
  label: LabelConfig;
  step?: StepModel;
}

export interface LabelConfig {
  title: string;
  subtitle: string;
}

export interface StepConfiguration {
  groupReport: string;
  translationPrefix: string;
  reportType: string;
  steps: ItemStepConfiguration[];
}
