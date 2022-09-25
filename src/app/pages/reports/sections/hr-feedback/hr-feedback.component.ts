import { Component, Input, OnInit } from '@angular/core';
import { HRFeedback } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { getDottedFirstCharacters } from 'src/app/core/utils/strings.util';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import {
  PopUpMessage,
  DislayType,
} from '../../../../shared/components/display-message/displayMessage.interface';

@Component({
  selector: 'app-hr-feedback',
  templateUrl: './hr-feedback.component.html',
  styleUrls: ['./hr-feedback.component.scss'],
})
export class HRFeedbackComponent implements OnInit {
  constructor(private displayMessageService: DisplayMessageService) {}
  @Input() hrFeedback: HRFeedback;
  introduction: string;

  ngOnInit(): void {
    this.loadDescription();
  }

  loadDescription(): void {
    this.introduction = getDottedFirstCharacters(this.hrFeedback.introduction);
  }

  showMore(): void {
    let ret = new PopUpMessage(this.hrFeedback.title);

    //TODO - Disenio: Ver como mostrar el contenido
    ret.introduction = this.hrFeedback.introduction;
    ret.description = this.hrFeedback.firstContent;

    this.displayMessageService.openPopUp(ret);
    this.displayMessageService.confirmedPopUp().subscribe(confirmed => {
      if (confirmed) {
        //TODO: Realiza alguna accion al cierre del modal
      }
    });
  }
}
