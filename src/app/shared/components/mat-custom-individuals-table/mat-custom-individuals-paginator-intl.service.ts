import { Injectable, OnDestroy } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

@Injectable()
export class MatCustomPaginatorIntlService
  extends MatPaginatorIntl
  implements OnDestroy
{
  //Variables
  INIT_LABEL = '';
  OF_LABEL = '';
  LAST_LABEL = '';
  //Subject
  unsubscribe: Subject<void> = new Subject<void>();

  constructor(private translate: TranslateService) {
    super();

    this.listenTranslationEvent();
    this.getAndInitTranslations();
  }

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  listenTranslationEvent(): void {
    this.translate.onLangChange
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(() => {
        this.getAndInitTranslations();
      });
  }

  getAndInitTranslations(): void {
    this.translate
      .get([
        'PAGINATOR.ITEMS_PER_PAGE',
        'PAGINATOR.NEXT_PAGE',
        'PAGINATOR.PREVIOUS_PAGE',
        'PAGINATOR.LAST_PAGE',
        'PAGINATOR.OF_LABEL',
        'PAGINATOR.INIT_LABEL',
        'PAGINATOR.LAST_LABEL',
      ])
      .pipe(takeUntil(this.unsubscribe))
      .subscribe(translation => {
        this.itemsPerPageLabel = translation['PAGINATOR.ITEMS_PER_PAGE'];
        this.nextPageLabel = translation['PAGINATOR.NEXT_PAGE'];
        this.previousPageLabel = translation['PAGINATOR.PREVIOUS_PAGE'];
        this.lastPageLabel = translation['PAGINATOR.LAST_PAGE'];
        this.INIT_LABEL = translation['PAGINATOR.INIT_LABEL'];
        this.OF_LABEL = translation['PAGINATOR.OF_LABEL'];
        this.LAST_LABEL = translation['PAGINATOR.LAST_LABEL'];

        this.changes.next();
      });
  }

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0 || pageSize === 0) {
      return `0 ${this.OF_LABEL} ${length}`;
    }
    length = Math.max(length, 0);
    const startIndex = page * pageSize;
    const endIndex =
      startIndex < length
        ? Math.min(startIndex + pageSize, length)
        : startIndex + pageSize;
    return `${this.INIT_LABEL} ${startIndex + 1} - ${endIndex} ${
      this.OF_LABEL
    } ${length} ${this.LAST_LABEL}`;
  };
}
