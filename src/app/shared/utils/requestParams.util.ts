import { HttpParams } from '@angular/common/http';
export function getParamsByObject(paramsObject: any): HttpParams {
  let params = new HttpParams();

  for (let key of Object.keys(paramsObject)) {
    params = params.set(key, paramsObject[key]);
  }

  return params;
}
