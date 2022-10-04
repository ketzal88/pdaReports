import { Component, Input, OnInit } from '@angular/core';
import {
  DislayType,
  PopUpMessage,
} from '../../../../shared/components/display-message/displayMessage.interface';
import { DisplayMessageService } from 'src/app/core/services/displayMessage.service';
import { getDottedLastCharacters } from '../../../../core/utils/strings.util';

@Component({
  selector: 'app-communication-style',
  templateUrl: './communication-style.component.html',
  styleUrls: ['./communication-style.component.scss'],
})
export class CommunicationStyleComponent implements OnInit {
  @Input() communicationTitle: string;
  @Input() communicationDescriptions: string[];

  description: string;

  constructor(private displayMessageService: DisplayMessageService) {}

  ngOnInit(): void {
    this.setDescription();
  }

  setDescription(): void {
    this.description = getDottedLastCharacters(
      this.communicationDescriptions[0]
    );
  }

  showMore(): void {
    let ret = new PopUpMessage(this.communicationTitle);
    ret.description = this.communicationDescriptions;
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
