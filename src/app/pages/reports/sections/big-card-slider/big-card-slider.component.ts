import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { CompetencyCompatibility } from 'src/app/core/services/microservices/reports/interfaces/pdaIndividualSectionsResponse.interface';
import { TippyService } from 'src/app/core/services/tippy.service';
import { getDottedFirstCharacters } from '../../../../core/utils/strings.util';

@Component({
  selector: 'app-big-card-slider',
  templateUrl: './big-card-slider.component.html',
  styleUrls: ['./big-card-slider.component.scss'],
})
export class BigCardSliderComponent implements OnInit, AfterViewInit {
  @Input() cards: Card[] = [];
  @ViewChildren('sliderDesktop') sliderDesktop!: QueryList<
    ElementRef<HTMLDivElement>
  >;
  indexedCards: IndexedCard[];
  index = 0;
  interval: number | null = null;
  constructor(private tippyService: TippyService) {}

  ngOnInit(): void {
    if (this.cards.length === 0) {
      this.cards.push({
        title: 'Título Descriptivo',
        content:
          'Revisión ¡lo más importante! Revisa la ortografía, gramática de los textos y asegúrate de colocar todos tus datos personales correctos.  Revisión ¡lo más importante! Revisa la ortografía, gramática de los textos y asegúrate de colocar todos tus datos.',
      });
      this.cards.push(this.cards[0]);
      this.cards.push(this.cards[0]);
      this.cards.push(this.cards[0]);
    }
    this.indexedCards = this.cards.map((x, i) => ({ ...x, cardIndex: i + 1 }));
    while (this.indexedCards.length < 4) {
      this.indexedCards.push(...this.indexedCards);
    }

    this.indexedCards.push(...this.indexedCards);
  }
  ngAfterViewInit(): void {
    this.setIndex(0);
  }
  formatText(text: string): string {
    return getDottedFirstCharacters(text, 38);
  }
  setIndex(i: number): void {
    this.index = i;
    if (this.interval !== null) {
      clearInterval(this.interval);
    }
    this.sliderDesktop.forEach((x, i) => {
      const mod = ((this.index + i) % (this.indexedCards.length / 2)) + 2;
      x.nativeElement.className =
        'card-slider ' +
        (mod === 0
          ? 'stay-left'
          : mod === 1
          ? 'to-small'
          : mod === 2
          ? 'to-big'
          : 'stay-right');
    });
    this.interval = setInterval(() => {
      const left = this.index > --this.index;

      if (this.index < 0) {
        this.index += this.indexedCards.length;
      }
      if (this.index >= this.indexedCards.length) {
        this.index = 0;
      }
      console.log('ITERATION INDEX: ' + this.index);
      this.sliderDesktop.forEach((x, i) => {
        let mod = this.index + i - 1;
        if (mod >= this.indexedCards.length) {
          mod -= this.indexedCards.length;
        }
        const newClass =
          mod === 0
            ? 'stay-left'
            : mod === 1
            ? left
              ? 'to-small-left'
              : 'stay-left'
            : mod === 2
            ? 'to-big'
            : mod === 3
            ? !left
              ? 'to-small-right'
              : 'stay-right'
            : '';
            
        x.nativeElement.className = 'card-slider ' + newClass;
        console.log(
          'index: ' +
            ((i % (this.indexedCards.length / 2)) + 1) +
            ' class: ' +
            newClass
        );
      });
    }, 8000) as unknown as number;
  }
}

interface Card {
  title: string;
  content: string;
}

interface IndexedCard extends Card {
  cardIndex: number;
}
