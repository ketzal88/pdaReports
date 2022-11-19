import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { CompetencyCompatibility } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { TippyService } from 'src/app/core/services/tippy.service';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';

@Component({
  selector: 'app-competencies-section',
  templateUrl: './competencies-section.component.html',
  styleUrls: ['./competencies-section.component.scss'],
})
export class CompetenciesSectionComponent implements OnInit, AfterViewInit {
  @Input() competencyCompatibility!: CompetencyCompatibility;
  @Input() forceSmall: boolean = false;
  @ViewChild('competencyTitle') container!: ElementRef;
  @ViewChildren('sliderDesktop') sliderDesktop!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  @ViewChildren('sliderMobile') sliderMobile!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  //progress bar
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 57;
  bufferValue = 75;
  mobileCompetencies = [];
  desktopCompetencies = [];
  mobileElements = 5;
  desktopElements = 10;
  index = 0;
  mobilePageCount = 0;
  desktopPageCount = 0;
  interval: number | null = null;
  constructor(private tippyService: TippyService) {}

  ngOnInit(): void {
    this.competencyCompatibility.competencyCompatibilityDetail.forEach(
      (x, i) => {
        let index = Math.floor(i / this.mobileElements);
        this.mobileCompetencies[index] = [
          ...(this.mobileCompetencies[index] ?? []),
          x,
        ];
        index = Math.floor(i / this.desktopElements);
        this.desktopCompetencies[index] = [
          ...(this.desktopCompetencies[index] ?? []),
          x,
        ];
      }
    );
    this.mobilePageCount = Math.ceil(
      this.competencyCompatibility.competencyCompatibilityDetail.length /
        this.mobileElements
    );
    this.desktopPageCount = Math.ceil(
      this.competencyCompatibility.competencyCompatibilityDetail.length /
        this.desktopElements
    );
  }
  ngAfterViewInit(): void {
    this.tippyService.setTooltipOnElement(
      this.container.nativeElement,
      'Es la capacidad para identificar relaciones entre situaciones que no están explícitamente interrelacionadas, a través de un razonamiento creativo o conceptual.'
    );
    this.setIndex(0);
  }
  formatText(text: string): string {
    return getDottedFirstCharacters(text, 38);
  }
  setIndex(i: number): void {
    this.index = i;
    if (this.interval !== null) {
      clearInterval(this.interval);
    }
    this.sliderMobile.forEach(
      x =>
        (x.nativeElement.style.transform =
          'translateX(-' + (this.index % this.mobilePageCount) * 100 + '%)')
    );
    this.sliderDesktop.forEach(
      x =>
        (x.nativeElement.style.transform =
          'translateX(-' + (this.index % this.desktopPageCount) * 100 + '%)')
    );
    this.interval = setInterval(() => {
      this.index += 1;
      this.sliderMobile.forEach(
        x =>
          (x.nativeElement.style.transform =
            'translateX(-' + (this.index % this.mobilePageCount) * 100 + '%)')
      );
      this.sliderDesktop.forEach(
        x =>
          (x.nativeElement.style.transform =
            'translateX(-' + (this.index % this.desktopPageCount) * 100 + '%)')
      );
    }, 8000) as unknown as number;
  }
}
