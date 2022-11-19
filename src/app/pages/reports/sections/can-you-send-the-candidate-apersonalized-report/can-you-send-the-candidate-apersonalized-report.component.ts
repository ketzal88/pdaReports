import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-can-you-send-the-candidate-apersonalized-report',
  templateUrl:
    './can-you-send-the-candidate-apersonalized-report.component.html',
  styleUrls: [
    './can-you-send-the-candidate-apersonalized-report.component.scss',
  ],
})
export class CanYouSendTheCandidateAPersonalizedReportComponent
  implements OnInit
{
  //Bindings
  imagetype: string;

  //Variables
  pathImagesSection = environment.pathImagesSection;

  //Inputs
  @Input() type: string;
  constructor() {}

  ngOnInit(): void {
    this.imagetype = `${this.pathImagesSection}${this.type}.png`;
  }
}
