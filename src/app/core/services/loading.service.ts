import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable()
export class LoadingService {
  private message: string = null;
  private _loading = new BehaviorSubject<boolean>(false);
  readonly loading$ = this._loading.asObservable().pipe(delay(1));

  constructor() {}

  show(): void {
    this._loading.next(true);
  }

  hide(): void {
    this._loading.next(false);
  }

  setMessage(message: string): void {
    this.message = message;
  }

  getMessage(): string {
    return this.message;
  }
}
