import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { KnowTheTheoryOfWillianMarston } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { ModalService } from '../../../../core/services/modal.service';
import { SeeMoreComponent } from '../../../../shared/components/modal/see-more/see-more.component';
import { SeeMoreOptions } from '../../../../shared/components/modal/see-more/interfaces/seeMoreOptions.interface';
import { SeeMoreData } from '../../../../shared/components/modal/see-more/interfaces/seeMoreData.interface';

@Component({
  selector: 'app-know-william-marston-theory',
  templateUrl: './know-william-marston-theory.component.html',
  styleUrls: ['./know-william-marston-theory.component.scss'],
})
export class KnowWilliamMarstonTheoryComponent implements OnInit {
  //Bindings
  imagetype: string;

  //Variables
  pathImagesSection = environment.pathImagesSection;

  //Inputs
  @Input() knowTheTheoryOfWillianMarston: KnowTheTheoryOfWillianMarston;
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
      title: this.knowTheTheoryOfWillianMarston.title,
      description: this.knowTheTheoryOfWillianMarston.description,
      html: `${this.knowTheTheoryOfWillianMarston.html}`,
    };

    return seeMoreData;
  }
}
