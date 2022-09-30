import { JobCompatibilityDetailed } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { JobCategory } from '../../../../core/services/microservices/job/job.interface';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  JobCompatibility,
  MultipleJobCompatibility,
} from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-job-compatibility-individual-area-section',
  templateUrl: './job-compatibility-individual-area-section.component.html',
  styleUrls: ['./job-compatibility-individual-area-section.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobCompatibilityIndividualAreaSectionComponent implements OnInit {
  @Input() jobCompatibilityDetailed: JobCompatibilityDetailed;
  @Input() multipleJobCompatibility: MultipleJobCompatibility[];
  @Input() jobCategory: JobCategory;

  constructor() {}

  ngOnInit(): void {
  }
}
