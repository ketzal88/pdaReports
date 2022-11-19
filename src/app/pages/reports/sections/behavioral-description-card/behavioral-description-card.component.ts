import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { TippyService } from 'src/app/core/services/tippy.service';

@Component({
  selector: 'app-behavioral-description-card',
  templateUrl: './behavioral-description-card.component.html',
  styleUrls: ['./behavioral-description-card.component.scss'],
})
export class BehavioralDescriptionCardComponent implements AfterViewInit {
  @Input() title: string;
  @Input() description: string;
  @Input() introduction: string = '';
  @ViewChild('titleElement') titleElement!: ElementRef;
  @Output() showMore: EventEmitter<any> = new EventEmitter();
  constructor(private tippyService: TippyService) {}
  ngAfterViewInit(): void {
    if (this.introduction && this.introduction !== '') {
      this.tippyService.setTooltipOnElement(
        this.titleElement.nativeElement,
        this.introduction
      );
    }
  }
}
