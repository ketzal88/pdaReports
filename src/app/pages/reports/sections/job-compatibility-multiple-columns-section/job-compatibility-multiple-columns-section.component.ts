import { Component, Input, OnInit } from '@angular/core';
import { JobCompatibilityFromGroup } from 'src/app/core/services/microservices/reports/interfaces/pdaGroupSectionsResponse.interface';

@Component({
  selector: 'app-job-compatibility-multiple-columns-section',
  templateUrl: './job-compatibility-multiple-columns-section.component.html',
  styleUrls: ['./job-compatibility-multiple-columns-section.component.scss'],
})
export class JobCompatibilityMultipleColumnsSectionComponent implements OnInit {
  @Input() jobCompatibilityFromGroup!: JobCompatibilityFromGroup[];
  @Input() selectedIndividualId!: string;
  constructor() {}

  ngOnInit(): void {}
}
