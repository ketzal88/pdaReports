import { Component, Input, OnInit } from '@angular/core';
import { DevelopmentPlan } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { getDottedFirstCharacters } from 'src/app/core/utils/strings.util';
import { DisplayMessageService } from '../../../../core/services/displayMessage.service';
import { NoSectionDataPipe } from '../../../../shared/pipes/no-section-data.pipe';
import { PopUpMessage } from '../../../../shared/components/display-message/displayMessage.interface';
import { SeeMoreOptions } from '../../../../shared/components/modal/see-more/interfaces/seeMoreOptions.interface';
import { SeeMoreData } from '../../../../shared/components/modal/see-more/interfaces/seeMoreData.interface';
import { ModalService } from '../../../../core/services/modal.service';
import { SeeMoreComponent } from '../../../../shared/components/modal/see-more/see-more.component';

@Component({
  selector: 'app-development-plan',
  templateUrl: './development-plan.component.html',
  styleUrls: ['./development-plan.component.scss'],
})
export class DevelopmentPlanComponent implements OnInit {
  constructor(
    private displayMessageService: DisplayMessageService,
    private noSectionDataPipe: NoSectionDataPipe,
    private modalService: ModalService
  ) {}
  @Input() developmentPlan: DevelopmentPlan;
  description: string;

  ngOnInit(): void {
    this.loadDescription();
  }

  loadDescription(): void {
    this.description = this.noSectionDataPipe.transform(
      getDottedFirstCharacters(this.developmentPlan.introduction)
    );
  }

  showMore(): void {
    // this.modalService.openPopUp(SeeMoreComponent, this.getParams());
    let ret = new PopUpMessage(this.developmentPlan.title);

    //TODO - Disenio: Ver como mostrar el contenido
    ret.introduction = this.developmentPlan.introduction;
    ret.description = this.developmentPlan.firstContent;

    this.displayMessageService.openShowMoreModal(ret);
    this.displayMessageService.confirmedShowMoreModal().subscribe(confirmed => {
      if (confirmed) {
        //TODO: Realiza alguna accion al cierre del modal
      }
    });
  }

  getParams(): any {
    let params = new SeeMoreOptions();
    params.data = this.getData();
    params.panelClass = 'see-more-modal';
    return params;
  }

  getData(): any {
    let seeMoreData: SeeMoreData = {
      title: this.developmentPlan.title,
      description: this.developmentPlan.firstContent,
      descriptionCard: this.developmentPlan.descriptions,
    };

    return seeMoreData;
  }
}
