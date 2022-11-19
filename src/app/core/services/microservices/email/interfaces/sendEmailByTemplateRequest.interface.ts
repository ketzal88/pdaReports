export interface SendEmailByTemplateRequest {
  mailId?: string;
  searchTemplateBy?: SearchTemplateBy;
  searchTemplateType?: SearchTemplateType;
  hasPriority?: boolean;
  mailIssuer?: string;
  baseId?: string;
  subBaseId?: string;
  userId?: string;
  from?: string;
  toList?: string[];
  ccList?: string[];
  ccoList?: string[];
  html?: string;
  keywords?: any;
}

export interface SearchTemplateBy {
  nameTemplateDefault?: string;
  templateId?: string;
}

export interface SearchTemplateType {
  templateType?: string;
  idLanguage?: string;
}
