import { Component, OnInit } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss'],
})
export class LoadingComponent implements OnInit {
  loading$: Observable<boolean>;

  constructor(private loader: LoadingService) {}

  ngOnInit(): void {
    this.loading$ = this.loader.loading$;
  }

  getMessage(): string {
    return this.loader.getMessage();
  }
}
