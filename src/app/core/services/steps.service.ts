import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StepModel } from '../models/step.model';
import { LocalStepModel } from '../../pages/report-central/configuration/interfaces/local-step-model.interface';

@Injectable()
export class StepsService {
  private steps$: BehaviorSubject<LocalStepModel[]> = new BehaviorSubject<
    LocalStepModel[]
  >([]);
  private currentStep$: BehaviorSubject<LocalStepModel | null> =
    new BehaviorSubject<LocalStepModel | null>(null);

  constructor() {}

  initSteps(steps: LocalStepModel[]): void {
    this.steps$ = new BehaviorSubject<LocalStepModel[]>(steps);
    this.currentStep$.next(this.steps$.value[0]);
  }

  setSteps(steps: LocalStepModel[]): void {
    this.steps$.next(steps);
  }

  setCurrentStep(step: LocalStepModel): void {
    this.currentStep$.next(step);
  }

  getCurrentStep(): Observable<LocalStepModel> {
    return this.currentStep$.asObservable();
  }

  getSteps(): Observable<LocalStepModel[]> {
    return this.steps$.asObservable();
  }

  moveToNextStep(): void {
    this.currentStep$.next(
      this.steps$.value[
        this.getNextEnabledIndex(this.currentStep$.value?.stepIndex)
      ]
    );
  }

  private getNextEnabledIndex(currentIndex: number): number {
    const thisIndex = currentIndex + 1;
    const nextItem = this.steps$.value[thisIndex];
    if (nextItem) {
      if (nextItem.isEnabled) {
        return thisIndex;
      }
      return this.getNextEnabledIndex(thisIndex);
    }
    return currentIndex;
  }

  private getPrevEnabledIndex(currentIndex: number): number {
    const thisIndex = currentIndex - 1;
    let prevItem = this.steps$.value[thisIndex];
    if (prevItem) {
      if (prevItem.isEnabled) {
        prevItem.isComplete = false;
        return thisIndex;
      }
      return this.getPrevEnabledIndex(thisIndex);
    }
    return currentIndex;
  }

  moveToPrevStep(): void {
    this.currentStep$.next(
      this.steps$.value[
        this.getPrevEnabledIndex(this.currentStep$.value?.stepIndex)
      ]
    );
  }

  isLastStep(): boolean {
    return this.currentStep$.value?.stepIndex === this.steps$.value.length - 1;
  }

  isLastStepAndComplete(): boolean {
    return (
      this.currentStep$.value?.stepIndex === this.steps$.value.length - 1 &&
      this.currentStep$.value?.isComplete
    );
  }

  isFirstStep(): boolean {
    return this.currentStep$.value?.stepIndex === 0;
  }
}
