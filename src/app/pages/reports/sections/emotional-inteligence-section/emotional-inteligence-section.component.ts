import { Component, Input, OnInit } from '@angular/core';
import { DisplayMessageService } from 'src/app/core/services/displayMessage.service';
import { EmotionalIntelligence } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { PopUpMessage } from '../../../../shared/components/display-message/displayMessage.interface';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';
import { NoSectionDataPipe } from '../../../../shared/pipes/no-section-data.pipe';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-emotional-inteligence-section',
  templateUrl: './emotional-inteligence-section.component.html',
  styleUrls: ['./emotional-inteligence-section.component.scss'],
})
export class EmotionalInteligenceSectionComponent implements OnInit {
  //Binding
  description: string;

  //Inputs
  @Input() emotionalIntelligence: EmotionalIntelligence;

  constructor(
    private displayMessageService: DisplayMessageService,
    private noSectionDataPipe: NoSectionDataPipe,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.description = this.noSectionDataPipe.transform(
      getDottedFirstCharacters(this.emotionalIntelligence.detail)
    );
  }

  showMore(): void {
    let ret = new PopUpMessage(
      this.translateService.instant(this.emotionalIntelligence.title)
    );
    ret.description = this.emotionalIntelligence.detail;
    ret.hasBackdrop = true;
    ret.disableClose = false;
    ret.closeOnNavigation = true;
    ret.closableOnlyWithButton = false;
    ret.backdropClass = '';
    this.displayMessageService.openShowMoreModal(ret);
    this.displayMessageService.confirmedShowMoreModal().subscribe(confirmed => {
      if (confirmed) {
        //TODO: Realiza alguna accion al cierre del modal
      }
    });
  }
}
