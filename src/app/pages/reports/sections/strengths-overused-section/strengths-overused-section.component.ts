import { Component, Input, OnInit } from '@angular/core';
import { CarouselItem } from '../../../../core/models/carousel-item.model';
import { CarouselType } from '../../../../core/consts/carousel-type.enum';
import { EffectiveLeadership } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-strengths-overused-section',
  templateUrl: './strengths-overused-section.component.html',
  styleUrls: ['./strengths-overused-section.component.scss'],
})
export class StrengthsOverusedSectionComponent implements OnInit {
  @Input() strengthsOverused: EffectiveLeadership;

  carouselData: CarouselItem[];
  type: string = CarouselType.TEXT_ONLY;

  constructor() {}

  ngOnInit(): void {
    this.loadDataCarousel();
  }

  loadDataCarousel(): void {
    this.carouselData = this.strengthsOverused.description.reduce(
      (newValue: CarouselItem[], currentValue: string, idx) => {
        let itemCarousel: CarouselItem = {
          id: idx,
          title: (idx + 1).toString(),
          subtitle: currentValue,
        };

        newValue.push(itemCarousel);
        return newValue;
      },
      []
    );
  }
}
