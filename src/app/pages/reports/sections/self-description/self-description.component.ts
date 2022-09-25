import { Component, OnInit, Input } from '@angular/core';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import { Introduction } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';
import {
  PopUpMessage,
  DislayType,
} from '../../../../shared/components/display-message/displayMessage.interface';

@Component({
  selector: 'app-self-description',
  templateUrl: './self-description.component.html',
  styleUrls: ['./self-description.component.scss'],
})
export class SelfDescriptionComponent implements OnInit {
  @Input() selfDescription: Introduction;

  description: string = '';
  constructor(private displayMessageService: DisplayMessageService) {}

  ngOnInit(): void {
    this.loadDescription();
  }

  loadDescription(): void {
    this.description = getDottedFirstCharacters(
      this.selfDescription.description
    );
  }

  showMore(): void {
    let ret = new PopUpMessage(this.selfDescription.title);
    ret.description = this.selfDescription.description;
    ret.hasBackdrop = true;
    ret.disableClose = false;
    ret.closeOnNavigation = false;
    ret.closableOnlyWithButton = false;
    ret.backdropClass = '';
    this.displayMessageService.openPopUp(ret);
    this.displayMessageService.confirmedPopUp().subscribe(confirmed => {
      console.log('confirmed: ', confirmed);
      if (confirmed) {
        //TODO: Realiza alguna accion al cierre del modal
      }
    });
  }
}
