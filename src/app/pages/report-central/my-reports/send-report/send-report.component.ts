import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
  Inject,
} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { combineLatest, Observable, Subscription, catchError, of } from 'rxjs';

import { unsubscribe } from '../../../../core/utils/subscription.util';
import { GuidService } from '../../../../core/services/guid.service';
import { StoreService } from '../../../../core/services/store.service';
import { GeneratedReport } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { EmailService } from '../../../../core/services/microservices/email/email.service';
import { EmailTemplateService } from '../../../../core/services/microservices/email/email-template.service';
import { SendReportOptions } from '../interfaces/send-report-options.interface';
import { SendEmailByTemplateRequest } from '../../../../core/services/microservices/email/interfaces/sendEmailByTemplateRequest.interface';
import { StoreKeys } from '../../../../core/consts/store-keys.enum';
import { environment } from '../../../../../environments/environment';
import {
  MailTemplateCustomResponse,
  MailTemplateCustom,
} from '../../../../core/services/microservices/email/interfaces/emailRemplateResponse.interface';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { EmailTemplateDefaultResponse } from '../../../../core/services/microservices/email/interfaces/emailTemplateDefaultResponse.interface';

@Component({
  selector: 'app-send-report',
  templateUrl: './send-report.component.html',
  styleUrls: ['./send-report.component.scss'],
})
export class SendReportComponent implements OnInit, OnDestroy {
  //bindings
  htmlContent: string;
  labelSelected: string;
  patternEmail = '^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$';

  //Variables
  guid: string;
  // mailTemplateCustom: MailTemplateCustom;
  mailTemplateCustom: EmailTemplateDefaultResponse;
  //TODO: Reemplazar por el tipo de datos de la lista de reportes generados
  reportList: GeneratedReport[];
  userId: string;
  reportUrl: string = environment.reportURL;

  //Forms
  sendEmailForm: FormGroup;

  //Subscriptions
  sendSetObsSub: Subscription;

  config: AngularEditorConfig;
  @Output() closedButton = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<SendReportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SendReportOptions,
    private emailService: EmailService,
    private emailTemplateService: EmailTemplateService,
    private guidService: GuidService,
    private storeService: StoreService,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.userId = this.storeService.getData(StoreKeys.USER_ID);
    this.initSendEmailForm();
    this.getMailTemplateDefault();
    this.initConfigHtml();
    this.loadLabelSelected();
  }

  ngOnDestroy(): void {
    unsubscribe(this.sendSetObsSub);
  }

  initSendEmailForm(): void {
    this.sendEmailForm = this.formBuilder.group({
      inputWhatsapp: [''],
      checkInputWhatsapp: [false],
      inputEmail: ['', [this.commaEmail]],
      checkInputEmail: [true],
      inputEmailsCc: ['', [this.commaEmail]],
      withoutSelected: [true],
      inputHtml: [''],
    });
  }

  getMailTemplateDefault(): void {
    let mailTemplateType = 'SendPDAReportLink';

    this.emailTemplateService
      .getTemplateDefault(
        mailTemplateType,
        this.data.baseId,
        this.data.subbaseId
      )
      .subscribe({
        next: (resp: EmailTemplateDefaultResponse) => {
          this.mailTemplateCustom = resp;
          this.inputHtml.setValue(this.mailTemplateCustom.html);
        },
        error: err => {
          console.log('error: ', err);
        },
      });
  }

  initConfigHtml(): void {
    this.config = {
      editable: true,
      spellcheck: true,
      height: '15rem',
      minHeight: '5rem',
      placeholder: 'Enter text here...',
      translate: 'no',
      defaultParagraphSeparator: 'p',
      defaultFontName: 'Arial',
      toolbarHiddenButtons: [['bold']],
      sanitize: false,
      customClasses: [
        {
          name: 'quote',
          class: 'quote',
        },
        {
          name: 'redText',
          class: 'redText',
        },
        {
          name: 'titleText',
          class: 'titleText',
          tag: 'h1',
        },
      ],
    };
  }

  loadLabelSelected(): void {
    if (this.data.reportList.length > 1) {
      this.labelSelected = `Se enviara los reportes a las ${this.data.reportList.length} personas seleccionadas`;
    } else {
      this.labelSelected = 'Se enviara los reportes a una persona seleccionada';
    }
  }

  changeCurrentWhatsapp(event: any): void {
    if (event.checked) {
      this.inputEmail.enable();
      this.inputEmailsCc.enable();
    } else {
      this.inputEmail.disable();
      this.inputEmailsCc.disable();
    }
  }

  closePopUp(): void {
    this.cancel();
    this.closedButton.emit();
  }

  cancel(): void {
    this.close(false);
  }
  close(value: any): void {
    this.dialogRef.close(value);
  }
  confirm(): void {
    this.close(true);
  }

  sendReport(): void {
    this.guid = this.guidService.generate();
    let templateType = 'SendPDAReportLink';

    let listObs = [];

    //Reportes enviados solo a los seleccionados
    if (this.withoutSelected && this.inputEmail.value === '') {
      for (let i = 0; i < this.data.reportList.length; i++) {
        let obs: Observable<any> = this.loadObsRequest(
          this.data.reportList[i],
          templateType,
          this.data.reportList[i]?.email ? [this.data.reportList[i].email] : []
        );
        listObs.push(obs);
      }
    }

    //Reportes enviados a los seleccionados y
    if (this.withoutSelected.value && this.inputEmail.value !== '') {
      for (let i = 0; i < this.data.reportList.length; i++) {
        let obs: Observable<any> = this.loadObsRequest(
          this.data.reportList[i],
          templateType,
          [this.data.reportList[i].email, ...this.inputEmail.value.split(';')]
        );
        listObs.push(obs);
      }
    }
    //Reportes enviados cuando decidimos no enviar a los seleccionados pero si a los ingresados de forma manual
    let emails: string[] = this.inputEmail.value.split(';');
    if (!this.withoutSelected.value && this.inputEmail.value !== '') {
      for (let i = 0; i < emails.length; i++) {
        for (let j = 0; j < this.data.reportList.length; j++) {
          let obs: Observable<any> = this.loadObsRequest(
            this.data.reportList[j],
            templateType,
            [emails[i]]
          );

          listObs.push(obs);
        }
      }
    }

    if (listObs.length > 0) {
      this.sendSetObsSub = combineLatest(...listObs)
        .pipe()
        .subscribe({
          next: (response: (any | any)[]) => {
            this.close({
              result: response,
              emails,
            });
          },
          error: (err: Error) => {},
          complete: () => {},
        });
    }
  }

  loadObsRequest(
    generatedReport: GeneratedReport,
    templateType: string,
    emails: string[]
  ): Observable<any> {
    let request: SendEmailByTemplateRequest = {
      // searchTemplateBy: {
      //   nameTemplateDefault: templateType,
      // },
      searchTemplateType: {
        templateType,
        // idLanguage: this.mailTemplateCustom.languageId,
      },
      hasPriority: true,
      baseId: this.data.baseId,
      subBaseId: this.data.subbaseId,
      userId: this.userId,
      from: this.mailTemplateCustom.from,
      toList: emails,
      ccList:
        this.inputEmailsCc && this.inputEmailsCc.value.length > 0
          ? this.inputEmailsCc.value.split(';')
          : null,
      html:
        this.inputHtml.value !== this.mailTemplateCustom.html
          ? this.inputHtml.value
          : null,
      keywords: {
        ReportLink: this.reportUrl + generatedReport.shortId,
      },
    };
    return this.emailService.sendEmailByTemplate(request).pipe(
      catchError(error => {
        console.log('error: ', error);
        return of(...emails);
      })
    );
  }

  onSlideToogle(event: MatSlideToggleChange): void {
    if (!event.checked) {
      this.sendEmailForm.markAllAsTouched();
    }
  }

  //Valid Comma Email
  commaEmail = (control: AbstractControl): { [key: string]: any } | null => {
    const emails = control.value.split(';');
    const forbidden = emails.some(email =>
      Validators.email(new FormControl(email))
    );
    return forbidden ? { inputEmail: { value: control.value } } : null;
  };

  //Getters form
  get inputEmail(): AbstractControl {
    return this.sendEmailForm.get('inputEmail');
  }

  get inputEmailsCc(): AbstractControl {
    return this.sendEmailForm.get('inputEmailsCc');
  }

  get inputWhatsapp(): AbstractControl {
    return this.sendEmailForm.get('inputWhatsapp');
  }

  get checkInputWhatsapp(): AbstractControl {
    return this.sendEmailForm.get('checkInputWhatsapp');
  }

  get checkInputEmail(): AbstractControl {
    return this.sendEmailForm.get('checkInputEmail');
  }

  get withoutSelected(): AbstractControl {
    return this.sendEmailForm.get('withoutSelected');
  }

  get inputHtml(): AbstractControl {
    return this.sendEmailForm.get('inputHtml');
  }
}
