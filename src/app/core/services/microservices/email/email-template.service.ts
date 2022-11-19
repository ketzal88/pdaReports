import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { MailTemplateCustomResponse } from './interfaces/emailRemplateResponse.interface';
import { EmailTemplateDefaultResponse } from './interfaces/emailTemplateDefaultResponse.interface';

@Injectable()
export class EmailTemplateService {
  basePath = environment.apiEmail;

  constructor(private httpClient: HttpClient) {}

  getTemplateDefault(
    mailTemplateType: string,
    baseId: string,
    subbaseId: string
  ): Observable<EmailTemplateDefaultResponse> {
    let queryParameters = new HttpParams();
    if (mailTemplateType !== undefined && mailTemplateType !== null) {
      queryParameters = queryParameters.set(
        'MailTemplateType',
        mailTemplateType
      );
    }
    if (baseId !== undefined && baseId !== null) {
      queryParameters = queryParameters.set('BaseId', <any>baseId);
    }
    if (subbaseId !== undefined && subbaseId !== null) {
      //TODO: Descomentar cuando este disponible para la subbase el nuevo mailTemplateType
      // queryParameters = queryParameters.set('SubbaseId', <any>subbaseId);
    }

    return this.httpClient.get<EmailTemplateDefaultResponse>(
      `${this.basePath}/Template/Default`,
      {
        params: queryParameters,
      }
    );
  }
}
