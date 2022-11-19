import { ItemStepConfiguration } from './interfaces/steps-configuration.interface';
export const SELECT_JOBS_STEP: ItemStepConfiguration = {
  name: 'selectJobs',
  label: {
    title: 'Selecciona el puesto',
    subtitle: 'sobre quién se realizara el reporte',
  },
  step: {
    isComplete: false,
    isEnabled: true,
  },
};
