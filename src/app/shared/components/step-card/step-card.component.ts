import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StepModel } from '../../../core/models/step.model';
import { StepsService } from '../../../core/services/steps.service';
import { ItemStepConfiguration } from '../../../core/configs/steps-configuration/interfaces/steps-configuration.interface';

@Component({
  selector: 'app-step-card',
  templateUrl: './step-card.component.html',
  styleUrls: ['./step-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StepCardComponent implements OnInit {
  //Bindings
  steps!: Observable<StepModel[]>;
  currentStep!: Observable<StepModel | null>;

  //Inputs
  @Input() configurationSteps!: ItemStepConfiguration[];

  constructor(private stepsService: StepsService) {}

  ngOnInit(): void {
    this.steps = this.stepsService.getSteps();
    this.currentStep = this.stepsService.getCurrentStep();
  }

  onStepClick(step: StepModel): void {
    this.stepsService.setCurrentStep(step);
  }
}
