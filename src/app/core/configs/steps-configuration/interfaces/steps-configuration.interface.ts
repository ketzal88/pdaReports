export interface ItemStepConfiguration {
  name: string;
  label: LabelConfig;
}

export interface LabelConfig {
  title: string;
  subtitle: string;
}

export interface StepConfiguration {
  groupReport: string;
  reportType: string;
  steps: ItemStepConfiguration[];
}
