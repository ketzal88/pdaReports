import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'report-background',
  templateUrl: './background.component.html',
  styleUrls: ['./background.component.scss']
})
export class BackgroundComponent implements OnInit {
  @Input() section!: string;
  @Input() report!: string;
  @Input() theme!: string;
  imagePath: string = "";
  class: string = "background-container";
  constructor() {
  }

  ngOnInit(): void {
    if (this.section === undefined || this.report === undefined || this.theme === undefined) {
      throw new Error("Missing theme or report");
    }
    let path = "background-" + this.section + "-" + this.report + "-" + this.theme;
    this.class += " " + path;
    this.imagePath = "/assets/img/reports/" + path + ".svg";
  }
}
