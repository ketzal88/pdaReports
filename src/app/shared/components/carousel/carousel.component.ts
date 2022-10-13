import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  HostListener,
} from '@angular/core';
import { CarouselItem } from '../../../core/models/carousel-item.model';
import { CarouselType } from '../../../core/consts/carousel-type.enum';
import { timer, take, Subscription, map, Observable } from 'rxjs';
import { unsubscribe } from '../../../core/utils/subscription.util';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
})
export class CarouselComponent implements OnInit {
  /**
   * Inputs
   */
  @Input() height = 500;
  @Input() isFullScreen = false;
  @Input() items: CarouselItem[] = [];
  @Input() contentType: string;
  /**
   * Variables
   */
  finalHeight: string | number = 0;
  currentPosition = 0;
  counter: Observable<number>;
  count: number = 6;
  firstTime: boolean = false;

  //ViewChild
  @ViewChild('carousel') divCarousel: ElementRef;

  //Bindings
  CarouselType = CarouselType;

  //Subscriptions
  timerSub: Subscription;

  constructor() {
    this.finalHeight = this.isFullScreen ? '100vh' : `${this.height}px`;
  }

  ngOnInit(): void {
    this.items.map((i, index) => {
      i.marginLeft = 0;
    });
  }

  initCountDown(): void {
    this.counter = timer(0, 3000).pipe(
      take(this.count),
      map(() => --this.count)
    );

    this.timerSub = this.counter.subscribe(data => {
      if (data === 0) {
        this.setNext();
        this.resetCountDown();
      }
    });
  }

  resetCountDown(): void {
    unsubscribe(this.timerSub);
    this.count = 6;
    this.initCountDown();
  }

  setCurrentPosition(position: number): void {
    this.currentPosition = position;
    this.items.find(i => i.id === 0).marginLeft = -100 * position;
  }

  setNext(): void {
    this.resetCountDown();
    let finalPercentage = 0;
    let nextPosition = this.currentPosition + 1;
    if (nextPosition <= this.items.length - 1) {
      finalPercentage = -100 * nextPosition;
    } else {
      nextPosition = 0;
    }
    this.items.find(i => i.id === 0).marginLeft = finalPercentage;
    this.currentPosition = nextPosition;
  }

  setBack(): void {
    this.resetCountDown();
    let finalPercentage = 0;
    let backPosition = this.currentPosition - 1;
    if (backPosition >= 0) {
      finalPercentage = -100 * backPosition;
    } else {
      backPosition = this.items.length - 1;
      finalPercentage = -100 * backPosition;
    }
    this.items.find(i => i.id === 0).marginLeft = finalPercentage;
    this.currentPosition = backPosition;
  }

  //TODO: Ver de llevarlo a una directiva
  @HostListener('document:scroll', ['$event'])
  onViewportScroll(): void {
    // Capturo la limitacion del div de carousel
    const boundingRectCarousel =
      this.divCarousel.nativeElement.getBoundingClientRect();

    if (
      boundingRectCarousel.top >= 0 &&
      boundingRectCarousel.left >= 0 &&
      boundingRectCarousel.right <=
        (window.innerWidth || document.documentElement.clientWidth) &&
      boundingRectCarousel.bottom <=
        (window.innerHeight || document.documentElement.clientHeight)
    ) {
      if (!this.firstTime) {
        this.firstTime = true;
        this.initCountDown();
      }
    } else {
      this.firstTime = false;
      unsubscribe(this.timerSub);
      this.count = 6;
      this.setCurrentPosition(0);
    }
  }
}
