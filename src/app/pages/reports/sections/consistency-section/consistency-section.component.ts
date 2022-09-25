import { Component, OnInit, Input } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { ConsistencyIndicator } from '../../../../core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';

@Component({
  selector: 'app-consistency-section',
  templateUrl: './consistency-section.component.html',
  styleUrls: ['./consistency-section.component.scss'],
})
export class ConsistencySectionComponent implements OnInit {
  @Input() consistencyIndicator!: ConsistencyIndicator;

  //progress bar
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 57;
  bufferValue = 75;

  constructor() {}

  ngOnInit(): void {}
}
