import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StateLanguage } from '../consts/state-language.enum';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class LanguageService {
  private stateLanguage$: BehaviorSubject<StateLanguage> =
    new BehaviorSubject<StateLanguage>(StateLanguage.NOT_CHANGE);

  constructor(
    private translate: TranslateService,
    private localStorageService: LocalStorageService
  ) {}

  getLanguageDefault(): string {
    return this.translate.store.defaultLang;
  }

  getLanguageCurrent(): string {
    return this.translate.store.currentLang;
  }

  setDefaultLanguage(): void {
    this.translate.setDefaultLang('es-AR');
    this.changeLanguage('es-AR');
  }

  changeLanguage(value: string): void {
    this.translate.use(value);
    this.localStorageService.setValue('language', value);
  }

  setChangeStateLanguage(stateLanguage: StateLanguage): void {
    this.stateLanguage$.next(stateLanguage);
  }

  getCurrentStateLanguage(): Observable<StateLanguage> {
    return this.stateLanguage$.asObservable();
  }
}
