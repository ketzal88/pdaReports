import { Component, Input, OnInit } from '@angular/core';
import { DisplayMessageService } from 'src/app/core/services/displayMessage.service';
import { EffectiveLeadership } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { PopUpMessage } from '../../../../shared/components/display-message/displayMessage.interface';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';
import { NoSectionDataPipe } from '../../../../shared/pipes/no-section-data.pipe';

@Component({
  selector: 'app-potential-deployment',
  templateUrl: './potential-deployment.component.html',
  styleUrls: ['./potential-deployment.component.scss'],
})
export class PotentialDeploymentComponent implements OnInit {
  //Inputs
  @Input() effectiveLeadership!: EffectiveLeadership;

  //Bindings
  description: string;

  constructor(
    private displayMessageService: DisplayMessageService,
    private noSectionDataPipe: NoSectionDataPipe
  ) {}

  ngOnInit(): void {
    this.description = this.noSectionDataPipe.transform(
      getDottedFirstCharacters(this.effectiveLeadership.description[0])
    );
  }

  showMore(): void {
    let ret = new PopUpMessage(this.effectiveLeadership.title);
    ret.description = this.effectiveLeadership.description;
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
