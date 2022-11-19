import { Component, OnInit, Input } from '@angular/core';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import { Introduction } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';
import { PopUpMessage } from '../../../../shared/components/display-message/displayMessage.interface';
import { NoSectionDataPipe } from '../../../../shared/pipes/no-section-data.pipe';

@Component({
  selector: 'app-self-description',
  templateUrl: './self-description.component.html',
  styleUrls: ['./self-description.component.scss'],
})
export class SelfDescriptionComponent implements OnInit {
  @Input() selfDescription: Introduction;

  description: string = '';
  constructor(
    private displayMessageService: DisplayMessageService,
    private noSectionDataPipe: NoSectionDataPipe
  ) {}

  ngOnInit(): void {
    this.loadDescription();
  }

  loadDescription(): void {
    this.description = this.noSectionDataPipe.transform(
      getDottedFirstCharacters(this.selfDescription.description)
    );
  }

  showMore(): void {
    let ret = new PopUpMessage(this.selfDescription.title);
    ret.description = this.description;
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
