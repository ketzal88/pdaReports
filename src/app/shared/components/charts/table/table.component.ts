import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  Input,
  ElementRef,
  SimpleChanges,
} from '@angular/core';
import 'anychart';
import { disabledCredits } from '../../../utils/chart.util';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent implements OnInit, AfterViewInit {
  @Input() idContainer: string;
  @Input() arrayValue: any[] = [
    [null, 'R', 'E', 'P', 'N', 'A'],
    ['Perfil', '0', '33', '100', '67', '0'],
    ['#', '4', '4', '9', '3', '4'],
    ['IE', '43%', '48%', '57%', '52%', '24%'],
  ];
  @Input() color: boolean;

  
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
    if (changes['color'] !== undefined) {
      this.color = changes['color'].currentValue;
      if (this.table) {
        this.table.dispose();
        this.ngOnInit();
        this.ngAfterViewInit();
      }
    }
  }

  stage: any;
  table!: any;

  //ViewChilds
  @ViewChild('chartContainer') container: ElementRef;
  constructor() {}

  ngOnInit(): void {
    // create table
    this.table = anychart.standalones.table();
    

    // set table content
    this.table.contents(this.arrayValue);

    this.table
      .getRow(0)
      .height(60) // set column width
      .cellFill('#00000000') // set column background color
      .fontSize(20)
      .fontWeight(800)
      .cellBorder('#00000000');
    this.table.getCol(0).width(70).fontWeight(900).fontColor('#000000');
    let cell = this.table.getCell(0, 1);
    cell.fontColor(this.color ? '#FF6819' : "#727276");
    cell = this.table.getCell(0, 2);
    cell.fontColor(this.color ? '#FFD100' : "#727276");
    cell = this.table.getCell(0, 3);
    cell.fontColor(this.color ? '#27ACF7' : "#727276");
    cell = this.table.getCell(0, 4);
    cell.fontColor(this.color ? '#2FB039' : "#727276");
    cell = this.table.getCell(0, 5);
    cell.fontColor(this.color ? '#8C24D2' : "#727276");

    // Set first column width 70 px and bold the text
    this.table
      .fontWeight(900)

      .fontColor('#000000');
    // set colors for ever and odd rows
    this.table.rowOddFill('#F2F3F3'); // color for odd rows
    this.table.rowEvenFill('#EAE9E9'); // color for even rows

    // adjust table border and position text in each cell into center
    this.table.cellBorder('#ffffff').vAlign('middle').hAlign('center');

    // set table container and initiate draw
  }
  ngAfterViewInit(): void {
    // set stage
    if (!this.stage) {
      this.stage = anychart.graphics.create(this.container.nativeElement.id);
    }
    this.table.container(this.stage).draw();
    disabledCredits(this.stage);
  }
}
