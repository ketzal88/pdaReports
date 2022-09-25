export interface GroupingRequest {
  groupingId?: string;
  name?: string;
  baseId?: string;
  subBaseId?: string;
}

export interface GroupingResponse {
  groupingId?: string;
  name?: string;
  baseId?: string;
  subBaseId?: string;
  creationDate?: Date;
  deletionDate?: Date;
}

export interface GroupAddRequest {
  groupingId?: string;
  name?: string;
  baseId?: string;
  subBaseId?: string;
  individualIds?: string[];
}
export interface GroupingIndividual {
  groupingIndividualId?: string;
  groupingId?: string;
  individualId?: string;
  creationDate?: Date;
}
