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
  selector: 'app-description-click-here-card',
  templateUrl: './description-click-here-card.component.html',
  styleUrls: ['./description-click-here-card.component.scss'],
})
export class DescriptionClickHereCardComponent implements AfterViewInit {
  @ViewChild('titleElement') titleElement!: ElementRef;
  @Input() title: string;
  @Input() titleBlue: string;
  @Input() description: string;

  constructor(private tippyService: TippyService) {}
  ngAfterViewInit(): void {}
}
