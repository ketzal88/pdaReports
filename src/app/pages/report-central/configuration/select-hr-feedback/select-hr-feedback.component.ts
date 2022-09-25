import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { StepModel } from 'src/app/core/models/step.model';
import { CdkTextareaAutosize } from '@angular/cdk/text-field';
import { take } from 'rxjs/operators';
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-select-hr-feedback',
  templateUrl: './select-hr-feedback.component.html',
  styleUrls: ['./select-hr-feedback.component.scss'],
})
export class SelectHrFeedbackComponent implements OnInit, AfterViewInit {
  //INPUTS
  @Input() step!: StepModel;
  @Input() selectedText: string;

  //OUTPUTS
  @Output() selectedItem = new EventEmitter<string>();

  constructor() {}

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
  }

  changedText(): void {
    this.hrFeedbackTextArea.nativeElement.value =
      this.hrFeedbackTextArea.nativeElement.value.replace(
        /[^a-z0-9 ,.?!]/gi,
        ''
      );
    this.selectedItem.emit(this.hrFeedbackTextArea.nativeElement.value);
  }
}
