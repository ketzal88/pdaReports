import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { CompetencyCompatibility, CompetencyCompatibilityDetail } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { getDottedFirstCharacters } from 'src/app/core/utils/strings.util';

@Component({
  selector: 'app-competencies-section',
  templateUrl: './competencies-section.component.html',
  styleUrls: ['./competencies-section.component.scss'],
})
export class CompetenciesSectionComponent implements OnInit {
  @Input() competencyCompatibility!: CompetencyCompatibility;
  //progress bar
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 57;
  bufferValue = 75;
  constructor() {}

  ngOnInit(): void {
  }
  getLeftCompetencies() {
    let array = this.competencyCompatibility.competencyCompatibilityDetail;
    return array?.slice(0, array.length / 2) ?? [];
  }
  getRightCompetencies() {
    let array = this.competencyCompatibility.competencyCompatibilityDetail;
    return array?.slice(array.length / 2) ?? [];
  }
  formatText(text: string) {
    return getDottedFirstCharacters(text, 38);
  }
}
