import { Component, Input, OnInit } from '@angular/core';
import {
  PopUpMessage,
  DislayType,
} from '../../../../shared/components/display-message/displayMessage.interface';
import { DisplayMessageService } from 'src/app/core/services/displayMessage.service';
import { CurrentSituation } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';

@Component({
  selector: 'app-current-situation',
  templateUrl: './current-situation.component.html',
  styleUrls: ['./current-situation.component.scss'],
})
export class CurrentSituationComponent implements OnInit {
  @Input() currentSituation: CurrentSituation;
  description: string;

  constructor(private displayMessageService: DisplayMessageService) {}

  ngOnInit(): void {
    this.loadDescription();
  }

  loadDescription(): void {
    this.description = getDottedFirstCharacters(
      this.currentSituation.introduction
    );
  }

  showMore(): void {
    let ret = new PopUpMessage(this.currentSituation.title);

    //TODO - Disenio: Ver como mostrar los datos de un array que contenga titulo y descripcion
    ret.description = this.currentSituation.currentSituationDetails.map(
      data => {
        return data.description;
      }
    );
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
