import { Component, Input, OnInit } from '@angular/core';
import { ProfileAgainstTheSkillsOfTheFuture } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { ModalService } from '../../../../core/services/modal.service';
import { SeeMoreComponent } from '../../../../shared/components/modal/see-more/see-more.component';
import { SeeMoreData } from '../../../../shared/components/modal/see-more/interfaces/seeMoreData.interface';
import { SeeMoreOptions } from '../../../../shared/components/modal/see-more/interfaces/seeMoreOptions.interface';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-know-your-profile-compared-skills-future',
  templateUrl: './know-your-profile-compared-skills-future.component.html',
  styleUrls: ['./know-your-profile-compared-skills-future.component.scss'],
})
export class KnowYourProfileComparedSkillsFutureComponent implements OnInit {
  //Bindings
  imagetype: string;

  //Variables
  pathImagesSection = environment.pathImagesSection;

  //Inputs
  @Input()
  profileAgainstTheSkillsOfTheFuture: ProfileAgainstTheSkillsOfTheFuture;
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
      title: this.profileAgainstTheSkillsOfTheFuture.title,
      description: this.profileAgainstTheSkillsOfTheFuture.description,
      html: `${this.profileAgainstTheSkillsOfTheFuture.html}`,
    };

    return seeMoreData;
  }
}
