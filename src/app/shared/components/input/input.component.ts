import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { debounceTime, Subject, take, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { unsubscribe } from '../../../core/utils/subscription.util';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit, OnDestroy {
  @Output() Enter: EventEmitter<string> = new EventEmitter();
  @Output() Debounce: EventEmitter<string> = new EventEmitter();

  @Input() placeholder: string = '';
  @Input() materialIcon: string = 'search';
  @Input() width: string = '60%';

  debouncer: Subject<string> = new Subject();

  searchTooltip: string;
  text: string = '';

  languageChangeSubscription: Subscription;

  constructor(private translateService: TranslateService) {}
  ngOnDestroy(): void {
    unsubscribe(this.languageChangeSubscription);
  }

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(1000)).subscribe(value => {
      this.Debounce.emit(value);
    });

    this.searchTooltip = this.translateService.instant('TOOLTIPS.SEARCH');

    this.languageChangeSubscription =
      this.translateService.onLangChange.subscribe(() => {
        this.searchTooltip = this.translateService.instant('TOOLTIPS.SEARCH');
      });
  }

  searchButton(): void {
    this.Enter.emit(this.text);
  }
  keyPressed(): void {
    this.debouncer.next(this.text);
  }
}
