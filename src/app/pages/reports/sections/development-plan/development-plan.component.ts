import { Component, Input, OnInit } from '@angular/core';
import { DevelopmentPlan } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { getDottedFirstCharacters } from 'src/app/core/utils/strings.util';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import {
  PopUpMessage,
  DislayType,
} from '../../../../shared/components/display-message/displayMessage.interface';

@Component({
  selector: 'app-development-plan',
  templateUrl: './development-plan.component.html',
  styleUrls: ['./development-plan.component.scss'],
})
export class DevelopmentPlanComponent implements OnInit {
  constructor(private displayMessageService: DisplayMessageService) {}
  @Input() developmentPlan: DevelopmentPlan;
  introduction: string;

  ngOnInit(): void {
    this.loadDescription();
  }

  loadDescription(): void {
    this.introduction = getDottedFirstCharacters(
      this.developmentPlan.introduction
    );
  }

  showMore(): void {
    let ret = new PopUpMessage(this.developmentPlan.title);

    //TODO - Disenio: Ver como mostrar el contenido
    ret.introduction = this.developmentPlan.introduction;
    ret.description = this.developmentPlan.firstContent;

    this.displayMessageService.openShowMoreModal(ret);
    this.displayMessageService.confirmedPopUp().subscribe(confirmed => {
      if (confirmed) {
        //TODO: Realiza alguna accion al cierre del modal
      }
    });
  }
}
