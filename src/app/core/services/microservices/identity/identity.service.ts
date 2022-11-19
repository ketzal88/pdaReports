import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import {
  LoginRequest,
  LoginResponse,
  RecoveryPasswordRequest,
} from './interfaces/dto/identity-dto.interface';
import { AuthenticationService } from '../../../authentication/authentication.service';
import { UsersAccount } from './identity.interface';

@Injectable()
export class IdentityService {
  basePath = environment.apiIdentity;
  constructor(
    private httpClient: HttpClient,
    private authenticationService: AuthenticationService
  ) {}

  loginUserBackEnd(param: LoginRequest): Observable<LoginResponse> {
    return this.httpClient.post<LoginResponse>(
      `${this.basePath}/Users/Login`,
      param
    );
  }

  loginUser(param: LoginRequest): Observable<boolean> {
    return this.httpClient
      .post<LoginResponse>(`${this.basePath}/Users/Login`, param)
      .pipe(
        map((response: LoginResponse) => {
          this.authenticationService.setToken(response);
          return true;
        }),
        catchError(error => {
          console.log(error);
          return of(false);
        })
      );
  }

  forgotPassword(username: string): Observable<boolean> {
    return this.httpClient.post<any>(
      `${this.basePath}/Users/ForgotPassword?username=${username}`,
      null
    );
  }

  recoveryPassword(request: RecoveryPasswordRequest): Observable<boolean> {
    return this.httpClient.post<any>(
      `${this.basePath}/Users/RecoveryPassword`,
      request
    );
  }

  validateToken(jwt: string): Observable<boolean> {
    return this.httpClient
      .post<boolean>(`${this.basePath}/Users/ValidateToken`, `"${jwt}"`)
      .pipe(
        map((response: boolean) => {
          return response;
        }),
        catchError(error => {
          return of(false);
        })
      );
  }

  getUsersAccount(userId: string): Observable<UsersAccount[]> {
    if (userId === undefined && userId === null) {
      throw new Error('userId is required.');
    }
    return this.httpClient.get<UsersAccount[]>(
      `${this.basePath}/UserAccounts/GetByUserId/` + userId
    );
  }
}
