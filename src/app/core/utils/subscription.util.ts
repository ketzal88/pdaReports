import { Subscription } from 'rxjs';

export function unsubscribe(subs: Subscription): void {
  if (subs) {
    subs.unsubscribe();
  }
}
