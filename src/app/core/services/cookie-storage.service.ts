import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface Cookie {
  name: string;
  value: any;
  session?: boolean;
  path?: string;
  protocol?: string;
  secure?: boolean;
  expireMinutes?: number;
  domain?: string;
}

@Injectable()
export class CookieStorageService {
  constructor() {}

  getCookie(name: string): string | null {
    let cookieArray: Array<string> = document.cookie.split(';');
    let cookieArrayLen: number = cookieArray.length;
    let cookieName = `${name}=`;
    let c: string;

    for (let i: number = 0; i < cookieArrayLen; i += 1) {
      c = cookieArray[i].replace(/^\s+/g, '');
      if (c.indexOf(cookieName) === 0) {
        return c.substring(cookieName.length, c.length);
      }
    }
    return null;
  }

  deleteCookie(cookieName): void {
    this.setCookie({ name: cookieName, value: '', expireMinutes: -1 });
  }

  /**
   * Expires default 30 minutes
   * If params.session is set and true expires is not added
   * If params.path is not set or value is not greater than 0 its default value will be root "/"
   * Secure flag can be activated only with https implemented
   * Examples of usage:
   * {service instance}.setCookie({name:'token',value:'abcd12345', session:true }); <- This cookie will not expire
   * {service instance}.setCookie({name:'userName',value:'John Doe', secure:true }); <- If page is not https then secure will not apply
   * {service instance}.setCookie({name:'niceCar', value:'red', expireMinutes:10 }); <- For all this examples if path is not provided default will be root
   */
  setCookie(params: Cookie): void {
    let d: Date = new Date();
    d.setTime(
      d.getTime() +
        (params.expireMinutes ? params.expireMinutes : 30) * 60 * 1000
    );
    const cookieToAdd =
      (params.name ? params.name : '') +
      '=' +
      (params.value ? params.value : '') +
      ';' +
      (params.session && params.session === true
        ? ''
        : 'expires=' + d.toUTCString() + ';') +
      'path=' +
      (params.path && params.path.length > 0 ? params.path : '/') +
      ';' +
      'domain=' +
      (params.domain && params.domain.length > 0
        ? params.domain
        : environment.cookieDomain) +
      ';' +
      (location.protocol === 'https:' && params.secure && params.secure === true
        ? 'secure'
        : '');
    document.cookie = cookieToAdd;
  }
}
