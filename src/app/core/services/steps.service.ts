import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StepModel } from '../models/step.model';

@Injectable()
export class StepsService {
  private steps$: BehaviorSubject<StepModel[]> = new BehaviorSubject<
    StepModel[]
  >([]);
  private currentStep$: BehaviorSubject<StepModel | null> =
    new BehaviorSubject<StepModel | null>(null);

  constructor() {}

  initSteps(steps: StepModel[]): void {
    this.steps$ = new BehaviorSubject<StepModel[]>(steps);
    this.currentStep$.next(this.steps$.value[0]);
  }

  setSteps(steps: StepModel[]): void {
    this.steps$.next(steps);
  }

  setCurrentStep(step: StepModel): void {
    this.currentStep$.next(step);
  }

  getCurrentStep(): Observable<StepModel | null> {
    return this.currentStep$.asObservable();
  }

  getSteps(): Observable<StepModel[]> {
    return this.steps$.asObservable();
  }

  moveToNextStep(): void {
    const index = this.currentStep$.value?.stepIndex;

    if (index && index < this.steps$.value.length) {
      this.currentStep$.next(this.steps$.value[index]);
    }
  }

  moveToPrevStep(): void {
    let index = this.currentStep$.value?.stepIndex;

    if (index && index - 1 < this.steps$.value.length) {
      index = index - 1;
      //TODO: Revisar si se requiere marcar como paso incompleto
      this.steps$.value[index].isComplete = false;
      this.currentStep$.next(this.steps$.value[index - 1]);
    }
  }

  isLastStep(): boolean {
    return this.currentStep$.value?.stepIndex === this.steps$.value.length;
  }

  isLastStepAndComplete(): boolean {
    return (
      this.currentStep$.value?.stepIndex === this.steps$.value.length &&
      this.currentStep$.value?.isComplete
    );
  }

  isFirstStep(): boolean {
    return this.currentStep$.value?.stepIndex === 1;
  }
}
