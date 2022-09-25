import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-report-central',
  templateUrl: './report-central.component.html',
  styleUrls: ['./report-central.component.scss'],
})
export class ReportCentralComponent implements OnInit, OnDestroy {
  //bindings

  selectedTabIndex: number;

  constructor() {}

  ngOnInit(): void {
    this.selectedTabIndex = 0;
  }

  ngOnDestroy(): void {}

  onTabChanged($event): void {
    this.selectedTabIndex = $event.index;
  }
}
