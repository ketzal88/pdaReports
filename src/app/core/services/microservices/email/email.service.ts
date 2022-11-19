import { Injectable } from '@angular/core';
import { SendEmailRequest } from './interfaces/sendEmailRequest.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { SendEmailByTemplateRequest } from './interfaces/sendEmailByTemplateRequest.interface';

@Injectable()
export class EmailService {
  basePath = environment.apiEmail;

  constructor(private httpClient: HttpClient) {}

  sendEmail(request: SendEmailRequest): Observable<string> {
    //Se agrega esta opcion para el tipo de respuesta del servicio
    let options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text',
    };

    return this.httpClient.post<string>(
      `${this.basePath}/Mail/SendEmail`,
      request,
      options
    );
  }

  sendEmailByTemplate(request: SendEmailByTemplateRequest): Observable<string> {
    return this.httpClient.post<string>(
      `${this.basePath}/Mail/SendEmailByTemplate`,
      request,
      {
        responseType: 'text' as 'json',
      }
    );
  }
}
