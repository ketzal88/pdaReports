import { PaginatedResponse } from '../../paginatedResponse.interface';

export interface MailTemplateCustom {
  mailTemplateCustomId: string;
  mailTemplateId: string;
  mailTemplateTypeId: string;
  name: string;
  baseId: string;
  subbaseId: string;
  languageId: string;
  mailFrom: string;
  mailTo: string;
  cc: string;
  bcc: string;
  subject: string;
  html: string;
  creationDate: Date;
  modificationDate: Date;
}

export interface MailTemplateCustomResponse
  extends PaginatedResponse<MailTemplateCustom> {}
