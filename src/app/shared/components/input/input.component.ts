import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
})
export class InputComponent implements OnInit {
  @Output() Enter: EventEmitter<string> = new EventEmitter();
  @Output() Debounce: EventEmitter<string> = new EventEmitter();

  @Input() placeholder: string = '';
  @Input() materialIcon: string = 'search';

  debouncer: Subject<string> = new Subject();

  text: string = '';

  constructor() {}

  ngOnInit(): void {
    this.debouncer.pipe(debounceTime(1000)).subscribe(value => {
      this.Debounce.emit(value);
    });
  }

  searchButton(): void {
    this.Enter.emit(this.text);
  }
  keyPressed(): void {
    this.debouncer.next(this.text);
  }
}
