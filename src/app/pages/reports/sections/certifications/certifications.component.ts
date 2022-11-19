import { Component, Input, OnInit } from '@angular/core';
import { LogosAndCertifications } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.component.html',
  styleUrls: ['./certifications.component.scss'],
})
export class CertificationsComponent implements OnInit {
  @Input() logosAndCertifications: LogosAndCertifications;

  constructor() {}

  ngOnInit(): void {}
}
