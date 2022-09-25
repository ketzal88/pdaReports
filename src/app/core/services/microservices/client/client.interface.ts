import { PaginatedResponse } from '../paginatedResponse.interface';
import { PaginatedRequest } from '../paginatedRequest.interface';

export interface ClientResponse {
  id?: string;
  name?: string;
  countryId?: string;
  link?: string;
  expirationDate?: Date;
  isLicence?: boolean;
  idBusinessUnit?: string;
  notVeryConsistentAsInvalid?: boolean;
  isPartner?: boolean;
  consumeCreditPerUser?: boolean;
  linkType?: string;
  creationDate?: Date;
  modificationDate?: Date;
  clientType?: string;
  startDate?: Date;
  licenseDuration?: number;
  companyEnabledtoOperate?: string;
  regionEnabledOperate?: string;
  active?: boolean;
  includesAuthorizationData?: boolean;
  allowsEntryMoreValidPDA?: boolean;
  noVerifyMail?: boolean;
  acceptConditions?: boolean;
  invalidMailDeliveryPDA?: boolean;
  allowsSendingReview?: boolean;
  publicProfile?: boolean;
  allowsPurchasePDA?: boolean;
  allowsPostEditing?: boolean;
  customerLogo?: boolean;
  hsLogoReports?: boolean;
  clientLogoReports?: boolean;
  customerFirstLogoReports?: boolean;
  crmId?: string;
  currencySale?: string;
  salePrice?: number;
  logoReportPath?: string;
}

export interface CustomerLogoReportRequest {
  id: string;
  logoPath: string;
  version?: string;
}

export interface SubBase {
  id?: string;
  baseId?: string;
  name?: string;
  countryId?: string;
  link?: string;
  default?: boolean;
  sendReview?: boolean;
  active?: boolean;
  creationDate?: string;
  modificationDate?: string;
  allowsFormParameters?: boolean;
  deletionDate?: string;
}
export interface GetSubBasesRequest extends PaginatedRequest {
  subbaseId?: string;
  baseId?: string;
  name?: string;
  link?: string;
}
export interface GetSubBasesResponse extends PaginatedResponse<SubBase> {}
