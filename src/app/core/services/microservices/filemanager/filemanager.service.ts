import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';

@Injectable()
export class FileManagerService {
  basePath = environment.apiFileManager;

  constructor(private httpClient: HttpClient) {}

  uploadImage(
    image: File,
    fileName: string,
    fileType: string
  ): Observable<string> {
    let queryParameters = new HttpParams();
    queryParameters = queryParameters.set('fileType', <string>fileType);

    const formData = new FormData();
    if (!fileName) {
      formData.append('image', image);
    } else {
      fileName =
        fileName +
        image.name.substring(image.name.lastIndexOf('.'), image.name.length);
      formData.append('image', image, fileName);
    }

    const headers = new HttpHeaders({ UndefinedContentType: 'true' });
    return this.httpClient.post<string>(
      this.basePath + '/api/Files',
      formData,
      {
        headers: headers,
        params: queryParameters,
        responseType: 'text' as 'json',
      }
    );
  }
}
