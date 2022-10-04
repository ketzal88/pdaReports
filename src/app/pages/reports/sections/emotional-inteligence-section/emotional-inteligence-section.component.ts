import { Component, Input, OnInit } from '@angular/core';
import { DisplayMessageService } from 'src/app/core/services/displayMessage.service';
import { EmotionalIntelligence } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { PopUpMessage } from '../../../../shared/components/display-message/displayMessage.interface';

@Component({
  selector: 'app-emotional-inteligence-section',
  templateUrl: './emotional-inteligence-section.component.html',
  styleUrls: ['./emotional-inteligence-section.component.scss'],
})
export class EmotionalInteligenceSectionComponent implements OnInit {
  @Input() emotionalIntelligence: EmotionalIntelligence;

  constructor(private displayMessageService: DisplayMessageService) {}

  ngOnInit(): void {}

  showMore(): void {
    let ret = new PopUpMessage('Inteligencia emocional');
    ret.description = this.emotionalIntelligence.detail;
    ret.hasBackdrop = true;
    ret.disableClose = false;
    ret.closeOnNavigation = false;
    ret.closableOnlyWithButton = false;
    ret.backdropClass = '';
    this.displayMessageService.openShowMoreModal(ret);
    this.displayMessageService.confirmedPopUp().subscribe(confirmed => {
      console.log('confirmed: ', confirmed);
      if (confirmed) {
        //TODO: Realiza alguna accion al cierre del modal
      }
    });
  }
}
