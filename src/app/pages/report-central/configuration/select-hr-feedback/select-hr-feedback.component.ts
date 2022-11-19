import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  AfterViewInit,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { StepModel } from 'src/app/core/models/step.model';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { GeneratedReportByIdResponse } from 'src/app/core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { StoreService } from '../../../../core/services/store.service';
import { StoreKeys } from 'src/app/core/consts/store-keys.enum';

@Component({
  selector: 'app-select-hr-feedback',
  templateUrl: './select-hr-feedback.component.html',
  styleUrls: ['./select-hr-feedback.component.scss'],
})
export class SelectHrFeedbackComponent implements OnInit, AfterViewInit {
  //INPUTS
  @Input() step!: StepModel;
  @Input() selectedText: string;
  @Input() generatedReportByIdResponse: GeneratedReportByIdResponse;

  //OUTPUTS
  @Output() selectedItem = new EventEmitter<string>();

  constructor(private storeService: StoreService) {}

  @ViewChild('autosize') autosize: CdkTextareaAutosize;
  @ViewChild('hrFeedbackTextArea') hrFeedbackTextArea: ElementRef;

  ngOnInit(): void {
    if (this.step) {
      this.step.isComplete = true;
    }
  }
  ngAfterViewInit(): void {
    if (this.selectedText) {
      this.hrFeedbackTextArea.nativeElement.value = this.selectedText;
    }

    let savedData = this.storeService.getData(StoreKeys.SELECTED_HRFEEDBACK);
    if (savedData) {
      this.hrFeedbackTextArea.nativeElement.value = savedData;
    } else if (
      this.generatedReportByIdResponse &&
      this.generatedReportByIdResponse.feedbackText
    ) {
      this.hrFeedbackTextArea.nativeElement.value =
        this.generatedReportByIdResponse.feedbackText;
    }
    this.selectedItem.emit(this.hrFeedbackTextArea.nativeElement.value);
  }

  changedText(): void {
    this.hrFeedbackTextArea.nativeElement.value =
      this.hrFeedbackTextArea.nativeElement.value.replace(
        /[^a-z0-9 ,.?!]/gi,
        ''
      );

    this.storeService.setData(
      StoreKeys.SELECTED_HRFEEDBACK,
      this.hrFeedbackTextArea.nativeElement.value
    );

    this.selectedItem.emit(this.hrFeedbackTextArea.nativeElement.value);
  }
}
