import { Component, OnInit } from '@angular/core';
import { DisplayMessageService } from 'src/app/core/services/displayMessage.service';
import {
  PopUpMessage,
  DislayType,
} from '../../../../shared/components/display-message/displayMessage.interface';

@Component({
  selector: 'app-discover-your-uniqueness',
  templateUrl: './discover-your-uniqueness.component.html',
  styleUrls: ['./discover-your-uniqueness.component.scss'],
})
export class DiscoverYourUniquenessComponent implements OnInit {
  constructor(private displayMessageService: DisplayMessageService) {}

  ngOnInit(): void {}

  showMore(): void {
    let ret = new PopUpMessage(
      'Descubre tu singularidad con el PDA Assessment'
    );
    ret.description =
      'Descripcion Descubre tu singularidad con el PDA Assessment';
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
