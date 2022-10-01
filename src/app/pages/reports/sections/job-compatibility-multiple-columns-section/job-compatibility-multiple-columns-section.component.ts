import { Component, Input, OnInit } from '@angular/core';
import { JobCompatibility } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-job-compatibility-multiple-columns-section',
  templateUrl: './job-compatibility-multiple-columns-section.component.html',
  styleUrls: ['./job-compatibility-multiple-columns-section.component.scss'],
})
export class JobCompatibilityMultipleColumnsSectionComponent implements OnInit {
  @Input() jobCompatibility!: JobCompatibility;

  constructor() {}

  ngOnInit(): void {
  }
}
