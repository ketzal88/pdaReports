import { PaginatedResponse } from '../paginatedResponse.interface';

export interface Competency {
  id: string;
  baseId?: string;
  subBaseId?: string;
  name?: string;
  description?: string;
  R?: number;
  E?: number;
  P?: number;
  N?: number;
  S?: number;
  competencyCategoryId?: string;
  order?: string;
  group?: string;
  modificationDate?: string;
  minimalCompatibility?: string;
}

export interface CompetencyCategory {
  competencyCategoryId: string;
  name?: string;
  description?: string;
  order?: string;
  competencyCategoryType?: CompetencyCategoryType;
}

export type CompetencyCategoryType =
  | 'PDA'
  | 'Global'
  | 'Predefined'
  | 'Behavioral'
  | '360Competency'
  | 'Generic'
  | 'Agile'
  | 'Entrepreneurship'
  | 'Digital'
  | 'VUCA';
export const CompetencyCategoryType = {
  PDA: 'PDA' as CompetencyCategoryType,
  Global: 'Global' as CompetencyCategoryType,
  Predefined: 'Predefined' as CompetencyCategoryType,
  Behavioral: 'Behavioral' as CompetencyCategoryType,
  _360Competency: '360Competency' as CompetencyCategoryType,
  Generic: 'Generic' as CompetencyCategoryType,
  Agile: 'Agile' as CompetencyCategoryType,
  Entrepreneurship: 'Entrepreneurship' as CompetencyCategoryType,
  Digital: 'Digital' as CompetencyCategoryType,
  VUCA: 'VUCA' as CompetencyCategoryType,
};

export interface GetCompetencyResponse extends PaginatedResponse<Competency> {}
