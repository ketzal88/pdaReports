import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import {
  CompetencyCompatibility,
  ConsistencyIndicator,
  CoverIndividual,
} from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-cover-individual-section',
  templateUrl: './cover-individual-section.component.html',
  styleUrls: ['./cover-individual-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoverIndividualSectionComponent implements OnInit {
  @Input() coverIndividual!: CoverIndividual;
  @Input() consistencyIndicator!: ConsistencyIndicator;
  @Input() competencyCompatibility!: CompetencyCompatibility;

  //progress bar
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 57;
  bufferValue = 75;

  constructor() {}

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnInit(): void {}
}
