import { Component, Input, OnInit } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { CompetencyCompatibility, CompetencyCompatibilityDetail } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

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
    console.warn(this.competencyCompatibility)
  }
  getLeftCompetencies() {
    let array = this.competencyCompatibility.competencyCompatibilityDetail;
    return array?.slice(0, array.length / 2) ?? [];
  }
  getRightCompetencies() {
    let array = this.competencyCompatibility.competencyCompatibilityDetail;
    return array?.slice(array.length / 2) ?? [];
  }
}
