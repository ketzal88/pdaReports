import { PaginatedResponse } from '../paginatedResponse.interface';

export interface Job {
  jobId?: string;
  baseId?: string;
  subBaseId?: string;
  name?: string;
  description?: string;
  r?: number;
  e?: number;
  p?: number;
  n?: number;
  s?: number;
  jobCategoryId?: string;
  isAutomatic?: boolean;
  behaviouralProfileCoreId?: string;
  creationDate?: Date;
}

export interface JobCategory {
  jobCategoryId?: string;
  name?: string;
  isCustomized?: boolean;
  order?: number;
}

export interface GetJobsResponse extends PaginatedResponse<Job> {}
