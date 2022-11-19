import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Observable } from 'rxjs';
import { StepModel } from '../../../core/models/step.model';
import { StepsService } from '../../../core/services/steps.service';
import { StepConfiguration } from '../../../core/configs/steps-configuration/interfaces/steps-configuration.interface';
import { LocalStepModel } from '../../../pages/report-central/configuration/interfaces/local-step-model.interface';

@Component({
  selector: 'app-step-card',
  templateUrl: './step-card.component.html',
  styleUrls: ['./step-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class StepCardComponent implements OnInit {
  //Bindings
  steps!: Observable<LocalStepModel[]>;
  currentStep!: Observable<LocalStepModel | null>;

  //Inputs
  @Input() stepConfiguration!: StepConfiguration;

  constructor(private stepsService: StepsService) {}

  ngOnInit(): void {
    this.steps = this.stepsService.getSteps();
    this.currentStep = this.stepsService.getCurrentStep();
  }

  onStepClick(step: LocalStepModel): void {
    this.stepsService.setCurrentStep(step);
  }
}
