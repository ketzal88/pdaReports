import { PaginatedRequest } from '../paginatedRequest.interface';
import { PaginatedResponse } from '../paginatedResponse.interface';

export enum Gender {
  Male = 'Male',
  Female = 'Female',
  NonBinary = 'NonBinary',
  NODEF = 'NODEF',
}
export enum Consistency {
  Consistent = 'Consistent',
  NotVeryConsistent = 'NotVeryConsistent',
  Invalid = 'Invalid',
  NotAvalaible = 'NotAvalaible',
}

export interface AddIndividualDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  regionId?: string;
  gender?: Gender;
  birthDate?: Date;
}

export interface VwGetAllIndividualWithBehaviouralProfile {
  individualId: string;
  baseId: string;
  subbaseId: string;
  firstName?: string;
  lastName?: string;
  email: string;
  creationDate?: Date;
  modificationDate?: Date;
  date?: Date;
  behaviouralProfileId?: string;
  behaviouralProfileName?: string;
  d?: number;
  i?: number;
  s?: number;
  c?: number;
  a?: number;
  consistencyIndicator?: number;
  consistencyText?: string;
  consistencyEnum?: Consistency;
  genderEnum?: Gender;
}

export interface GetIndividualRegionResponse
  extends PaginatedResponse<IndividualRegion> {}

export interface GetIndividualDTO {
  id?: string;
  baseId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: boolean;
  languageId?: string;
  sendPDAReport?: boolean;
  creationDate?: Date;
  modificationDate?: Date;
  enterByWs?: boolean;
  date?: Date;
  withoutPDAComplete?: number;
  birthDate?: Date;
  links?: Array<Link>;
}
export interface Individual {
  id?: string;
  baseId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: boolean;
  languageId?: string;
  sendPDAReport?: boolean;
  creationDate?: Date;
  modificationDate?: Date;
  enterByWs?: boolean;
  date?: Date;
  withoutPDAComplete?: number;
  birthDate?: Date;
}

export interface IndividualRegion {
  individualId?: string;
  regionId?: string;
  date?: Date;
  endDate?: Date;
  active?: boolean;
}

export interface Link {
  readonly href?: string;
  readonly rel?: string;
  readonly method?: string;
}

export interface GetAllIndividualWithBehaviouralProfileResponse
  extends PaginatedResponse<VwGetAllIndividualWithBehaviouralProfile> {}

export interface GetAllIndividualWithBehaviouralProfileRequest
  extends PaginatedRequest {
  baseId?: string;
  subbaseId?: string;
  areaId?: string;
  groupingId?: string;
  filter?: string;
  consistencyList?: string[];
  dateFrom?: string;
  dateTo?: string;
  genderList?: number[];
}

export interface GetAllIndividualRequest extends PaginatedRequest {
  id?: string;
  baseId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  gender?: boolean;
  languageId?: string;
  sendPDAReport?: boolean;
  creationDate?: Date;
  modificationDate?: Date;
  enterByWs?: boolean;
  date?: Date;
  withoutPDAComplete?: number;
  birthDate?: Date;
}

export interface GetAllIndividualResponse
  extends PaginatedResponse<GetIndividualDTO> {}
