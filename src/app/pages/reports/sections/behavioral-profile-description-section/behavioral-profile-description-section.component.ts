import { Component, Input, OnInit } from '@angular/core';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import { BehavioralProfileDescription } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';
import {
  PopUpMessage,
  DislayType,
} from '../../../../shared/components/display-message/displayMessage.interface';

@Component({
  selector: 'app-behavioral-profile-description-section',
  templateUrl: './behavioral-profile-description-section.component.html',
  styleUrls: ['./behavioral-profile-description-section.component.scss'],
})
export class BehavioralProfileDescriptionSectionComponent implements OnInit {
  @Input() behavioralProfileDescription: BehavioralProfileDescription;

  description: string;

  constructor(private displayMessageService: DisplayMessageService) {}

  ngOnInit(): void {
    this.description = getDottedFirstCharacters(
      this.behavioralProfileDescription.description
    );
  }

  showMore(): void {
    let ret = new PopUpMessage(this.behavioralProfileDescription.title);
    ret.description = this.behavioralProfileDescription.description;
    ret.hasBackdrop = true;
    ret.disableClose = false;
    ret.closeOnNavigation = true;
    ret.closableOnlyWithButton = false;
    ret.backdropClass = '';
    this.displayMessageService.openShowMoreModal(ret);
    this.displayMessageService.confirmedShowMoreModal().subscribe(confirmed => {
      console.log('confirmed: ', confirmed);
      if (confirmed) {
        //TODO: Realiza alguna accion al cierre del modal
      }
    });
  }
}
