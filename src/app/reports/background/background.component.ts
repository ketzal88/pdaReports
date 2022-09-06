import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'report-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  @Input() reportStyle!: string;
  @Input() index!: string;
  imagePath: string = "";
  
  constructor() {
  }

  ngOnInit(): void {
    if (this.index === undefined || this.reportStyle === undefined) {
      throw new Error("Missing index or reportStyle");
    }
    this.imagePath = "/assets/img/reports/background-0" + this.index + "-" + this.reportStyle + ".svg";
  }
}
