import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StateLanguage } from 'src/app/core/consts/state-language.enum';
import { AuthenticationService } from '../../core/authentication/authentication.service';
import { LanguageService } from '../../core/services/language.service';
import { environment } from '../../../environments/environment';

interface Language {
  value: string;
  language: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  selectedValue: string;
  version: string = environment.version;

  foods: Language[] = [
    { value: 'en', language: 'English' },
    { value: 'es-AR', language: 'Español' },
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private router: Router,
    private languageService: LanguageService
  ) {}

  ngOnInit(): void {
    this.selectedValue = this.languageService.getLanguageDefault() || 'es-AR';
  }

  ngOnDestroy(): void {}

  logout(): void {
    this.authenticationService.logOut();
    this.router.navigate(['/login']);
  }

  changeLanguage(event: any): void {
    this.languageService.changeLanguage(event.value);
    //TODO - JORDY: Se emite evento para indicar el cambio de idioma
    this.languageService.setChangeStateLanguage(StateLanguage.CHANGING);
  }
}
