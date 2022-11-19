import { Component, Input, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-share-your-profile-in-the-rrss',
  templateUrl: './share-your-profile-in-the-rrss.component.html',
  styleUrls: ['./share-your-profile-in-the-rrss.component.scss'],
})
export class ShareYourProfileInTheRRSSComponent implements OnInit {
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
