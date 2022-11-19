import { Component, Input, OnInit } from '@angular/core';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import { NoSectionDataPipe } from '../../../../shared/pipes/no-section-data.pipe';
import {
  getDottedFirstCharacters,
  getDottedLastCharacters,
} from '../../../../core/utils/strings.util';
import {
  PopUpMessage,
  DislayType,
} from '../../../../shared/components/display-message/displayMessage.interface';

@Component({
  selector: 'app-how-to-lead-individual',
  templateUrl: './how-to-lead-individual.component.html',
  styleUrls: ['./how-to-lead-individual.component.scss'],
})
export class HowToLeadIndividualComponent implements OnInit {
  //Inputs
  @Input() leadershipTitle: string;
  @Input() leadershipDescriptions: string[];

  //Bindinds
  description: string;

  constructor(
    private displayMessageService: DisplayMessageService,
    private noSectionDataPipe: NoSectionDataPipe
  ) {}

  ngOnInit(): void {
    this.description = this.noSectionDataPipe.transform(
      getDottedFirstCharacters(this.leadershipDescriptions[0])
    );
  }

  showMore(): void {
    let ret = new PopUpMessage(this.leadershipTitle);
    ret.description = this.leadershipDescriptions;
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
