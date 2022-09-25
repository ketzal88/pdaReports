import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Subscription } from 'rxjs';
import { SendEmailService } from '../../../../core/services/microservices/email/send-email.service';
import {
  Mail,
  MailInfo,
  SendEmailRequest,
} from '../../../../core/services/microservices/email/sendEmailRequest.interface';
import { unsubscribe } from '../../../../core/utils/subscription.util';
import { GuidService } from '../../../../core/services/guid.service';
import { StoreService } from '../../../../core/services/store.service';
import { VwGetAllIndividualWithBehaviouralProfile } from '../../../../core/services/microservices/individual/individual.interface';
import { GeneratedReport } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';

@Component({
  selector: 'app-send-report',
  templateUrl: './send-report.component.html',
  styleUrls: ['./send-report.component.scss'],
})
export class SendReportComponent implements OnInit, OnDestroy {
  //bindings
  htmlContent: string;
  inputWhatsapp: string;
  inputEmails: string;
  inputEmailsCc: string;
  patternEmail = '^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$';

  //Variables
  guid: string;
  //TODO: Reemplazar por el tipo de datos de la lista de reportes generados
  reportList: GeneratedReport[];

  //Subscriptions
  sendEmailSub: Subscription;

  config: AngularEditorConfig;
  @Output() closedButton = new EventEmitter();
  constructor(
    public dialogRef: MatDialogRef<SendReportComponent>,
    private sendEmailService: SendEmailService,
    private guidService: GuidService,
    private storeService: StoreService
  ) {}

  ngOnInit(): void {
    this.htmlContent = '';
    this.inputWhatsapp = '';
    this.inputEmails = '';
    this.initConfigHtml();
    this.loadReportList();
    this.loadHtmlContent();
  }

  ngOnDestroy(): void {
    unsubscribe(this.sendEmailSub);
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

  loadReportList(): void {
    this.reportList = this.storeService.getData('reportList');
    console.log('reportList: ', this.reportList);
  }

  loadHtmlContent(): void {
    for (let i = 0; i < this.reportList.length; i++) {
      this.htmlContent += this.reportList[i].individualId + '<br>';
    }
  }

  changeCurrentWhatsapp(event: any): void {
    console.log('event: ', event);
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
    let param: SendEmailRequest = {
      mail: null,
      mailInfo: null,
      mailAttachment: [],
    };

    param.mail = this.getMail();
    param.mailInfo = this.getMailInfo();

    this.sendEmailSub = this.sendEmailService.sendEmail(param).subscribe({
      next: (response: string) => {
        this.confirm();
      },
      error: err => {
        console.log('error: ', err);
      },
    });
    // .subscribe(data => {
    //   this.confirm();
    // });
  }

  getMail(): Mail {
    let mail: Mail = {
      mailId: this.guid,
      mailFrom: 'support@pdainternational.net',
      mailTo: this.inputEmails,
      cc: this.inputEmailsCc,
      bcc: null,
      subject: 'Envio reporte',
      html: this.htmlContent,
      createdDate: new Date(),
      sendedDate: null,
      sendedStatus: null,
      parentId: null,
    };
    return mail;
  }

  getMailInfo(): MailInfo {
    let mailInfo: MailInfo = {
      mailId: this.guid,
      hasPriority: false,
      mailIssuer: 'Angular-reports',
      baseId: 'd92c7492-be33-4adb-b8a1-051248d315dd',
      subbaseId: '13cd5f84-135b-47f4-929e-d538134f2d92',
      userId: '2c5926c4-bda2-4edf-9bf8-8w9222b2dc8b',
      templateId: null,
      templateName: null,
    };

    return mailInfo;
  }
}
