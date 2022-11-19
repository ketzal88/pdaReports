import { ItemStepConfiguration } from './interfaces/steps-configuration.interface';
export const SELECT_GROUP_STEP: ItemStepConfiguration = {
  name: 'selectGroup',
  label: {
    title: 'Conformar grupo de candidatos',
    subtitle: 'contra quién se realizara el reporte',
  },
  step: {
    isComplete: false,
    isEnabled: true,
  },
};
