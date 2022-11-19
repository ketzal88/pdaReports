export interface SendEmailRequest {
  mail: Mail;
  mailInfo: MailInfo;
  mailAttachment: MailAttachment[];
}

export interface Mail {
  mailId: string;
  mailFrom: string;
  mailTo: string;
  cc: string;
  bcc: string;
  subject: string;
  html: string;
  createdDate: Date;
  sendedDate: Date;
  sendedStatus: string;
  parentId: string;
}

export interface MailAttachment {
  mailAttachmentId: string;
  mailId: string;
  fileName: string;
  fileExtension: string;
  url: string;
}

export interface MailInfo {
  mailId: string;
  hasPriority: boolean;
  mailIssuer: string;
  baseId: string;
  subbaseId: string;
  userId: string;
  templateId: string;
  templateName: string;
}
