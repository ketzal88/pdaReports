import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  HttpClient,
  HttpClientModule,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { AuthInterceptor } from './core/interceptors/auth.interceptor';
import { LocalStorageService } from './core/services/local-storage.service';
import { MaterialModule } from './shared/material/material.module';
import { CommonModule } from '@angular/common';
import { TokenValidationInterceptor } from './core/interceptors/tokenValidation.interceptor';
import { ReportsEventService } from './pages/reports/reports-event.service';
import { CookieStorageService } from './core/services/cookie-storage.service';
import { ErrorManagerService } from './core/services/errorManager.service';
import { DisplayMessageModule } from './shared/components/display-message/display-message.module';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { LanguageService } from './core/services/language.service';
import { DisplayMessageService } from './core/services/displayMessage.service';
import { StoreService } from './core/services/store.service';
import { CssColorService } from './core/services/css-color.service';
import { IdentityService } from './core/services/microservices/identity/identity.service';
import { LoginComponent } from './unauthorized/login/login.component';
import { NopageComponent } from './unauthorized/noPage/nopage.component';
import { ImageDragDirective } from './shared/components/uploaders/image-uploader/image-drag-directive';
import { FileManagerService } from './core/services/microservices/filemanager/filemanager.service';
import { ModalService } from './core/services/modal.service';
import { SendEmailService } from './core/services/microservices/email/send-email.service';
import { IndividualService } from './core/services/microservices/individual/individual.service';
import { GenderService } from './core/services/microservices/individual/gender.service';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient): TranslateHttpLoader {
  return new TranslateHttpLoader(
    http,
    './assets/i18n/',
    '.json?cb=' + new Date().getTime()
  );
}

@NgModule({
  declarations: [AppComponent, NopageComponent, LoginComponent],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    NoopAnimationsModule,
    MaterialModule,
    HttpClientModule,
    ReactiveFormsModule,
    DisplayMessageModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  exports: [],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenValidationInterceptor,
      multi: true,
    },
    ImageDragDirective,
    LocalStorageService,
    CssColorService,
    IdentityService,
    IndividualService,
    FileManagerService,
    ReportsEventService,
    CookieStorageService,
    ErrorManagerService,
    LanguageService,
    DisplayMessageService,
    ModalService,
    StoreService,
    GenderService,
    SendEmailService, //TODO: Acomodar servicios
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
