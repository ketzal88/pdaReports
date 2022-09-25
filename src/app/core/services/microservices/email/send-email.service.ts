import { Injectable } from '@angular/core';
import { SendEmailRequest } from './sendEmailRequest.interface';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class SendEmailService {
  basePath = environment.apiEmail;

  constructor(private httpClient: HttpClient) {}

  sendEmail(param: SendEmailRequest): Observable<string> {
    //Se agrega esta opcion para el tipo de respuesta del servicio
    let options: Object = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      responseType: 'text',
    };

    return this.httpClient.post<string>(
      `${this.basePath}/Mail/SendEmail`,
      param,
      options
    );
  }
}
