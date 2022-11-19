export interface ItemStepConfiguration {
  name: string;
  label: LabelConfig;
  step?: StepModel;
}

export interface LabelConfig {
  title: string;
  subtitle: string;
}

export interface StepModel {
  isEnabled: boolean;
  isComplete: boolean;
}

export interface StepConfigurationResponse {
  groupReport: string;
  translationPrefix: string;
  reportType: string;
  steps: ItemStepConfiguration[];
}
