export interface AreaRequest {
  areaId?: string;
  name?: string;
  baseId?: string;
  subBaseId?: string;
}

export interface AreaAddRequest {
  areaId?: string;
  name?: string;
  baseId?: string;
  subBaseId?: string;
  individualIds?: string[];
}

export interface AreaResponse {
  areaId?: string;
  name?: string;
  baseId?: string;
  subBaseId?: string;
  creationDate?: Date;
  deletionDate?: Date;
}

export interface AreaIndividual {
  areaIndividualId?: string;
  areaId?: string;
  individual?: string;
  creationDate?: Date;
}
