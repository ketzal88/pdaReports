import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LearnMoreAboutYourBehavioralProfile } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { SeeMoreComponent } from '../../../../shared/components/modal/see-more/see-more.component';
import { SeeMoreOptions } from '../../../../shared/components/modal/see-more/interfaces/seeMoreOptions.interface';
import { SeeMoreData } from '../../../../shared/components/modal/see-more/interfaces/seeMoreData.interface';
import { ModalService } from '../../../../core/services/modal.service';

@Component({
  selector: 'app-know-more-behavioral-profile',
  templateUrl: './know-more-behavioral-profile.component.html',
  styleUrls: ['./know-more-behavioral-profile.component.scss'],
})
export class KnowMoreBehavioralProfileComponent implements OnInit {
  //Bindings
  imagetype: string;

  //Variables
  pathImagesSection = environment.pathImagesSection;

  @Input()
  learnMoreAboutYourBehavioralProfile: LearnMoreAboutYourBehavioralProfile;
  @Input() type: string;

  constructor(private modalService: ModalService) {}

  ngOnInit(): void {
    this.imagetype = `${this.pathImagesSection}${this.type}.png`;
  }

  showMore(): void {
    this.modalService.openPopUp(SeeMoreComponent, this.getParams());
  }

  getParams(): any {
    let params = new SeeMoreOptions();
    params.data = this.getData();
    params.panelClass = 'see-more-modal';
    return params;
  }

  getData(): any {
    let seeMoreData: SeeMoreData = {
      title: this.learnMoreAboutYourBehavioralProfile.title,
      description: this.learnMoreAboutYourBehavioralProfile.description,
      html: `${this.learnMoreAboutYourBehavioralProfile.html}`,
    };

    return seeMoreData;
  }
}
