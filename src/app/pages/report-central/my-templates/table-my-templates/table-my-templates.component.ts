import {
  Component,
  OnInit,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { GeneratedReport } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';
import { TypeFilterItem } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter-item.interface';
import { TypeFilter } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { TableColumn } from '../../../../shared/components/mat-custom-individuals-table/models/tableColumn.interface';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  selector: 'app-table-my-templates',
  templateUrl: './table-my-templates.component.html',
  styleUrls: ['./table-my-templates.component.scss'],
})
export class TableMyTemplatesComponent implements OnInit, AfterViewInit {
  //Bindings
  displayedColumns: string[] = [];
  valueInput: string;
  checkedLeader = false;
  disabledLeader = false;
  showFilter: boolean = false;
  selectedReport: GeneratedReport[];

  filtersChips: TypeFilterItem[] = [];
  chipItems: TypeFilterItem[] = [];

  typeFilterItemsSelected: TypeFilter[] = [];

  selection = new SelectionModel<GeneratedReport>(true, []);

  //Tooltips
  languageChangeSubscription: Subscription;
  useTemplateTooltip: string;
  deleteTemplateTooltip: string;
  renameTemplateTooltip: string;
  duplicateTemplateTooltip: string;

  filterTooltip: string;

  //Viewchilds
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //Inputs
  @Input() columns: Array<TableColumn>;
  @Input() hasSelectActions: boolean = false;
  @Input() totalSize: number = 0;
  @Input() dataSource: MatTableDataSource<any>;
  @Input() typeFilterList!: TypeFilter[];
  @Input() pageCurrent: number = 0;

  @Input() parentType: string = 'Individual';

  //Outputs
  @Output() paginateChange: EventEmitter<PageEvent> =
    new EventEmitter<PageEvent>();
  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterInput: EventEmitter<string> = new EventEmitter<string>();
  @Output() filters: EventEmitter<TypeFilter[]> = new EventEmitter<
    TypeFilter[]
  >();

  @Output() deleteReportEvent: EventEmitter<GeneratedReport> =
    new EventEmitter<GeneratedReport>();

  @Output() duplicateReportEvent: EventEmitter<GeneratedReport> =
    new EventEmitter<GeneratedReport>();

  @Output() renameReportEvent: EventEmitter<GeneratedReport> =
    new EventEmitter<GeneratedReport>();

  @Output() editReportSettingEvent: EventEmitter<GeneratedReport> =
    new EventEmitter<GeneratedReport>();

  //Paginator
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageSize: number = 10;
  //TODO: ESTE PAGESIZE DEBE SER UN INPUT PARA QUE SE PUEDA ELEGIR DESDE EL COMPONENTE EL PAGINADO INCIAL.

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    // Se agrega de forma opcional la columna de checkbox

    // Se agrega columnas para mostrar los datos
    this.displayedColumns = this.displayedColumns.concat(
      this.columns.map(x => x.columnDef)
    );

    // De forma opcional se agrega la columna leader
    if (this.hasSelectActions) {
      this.displayedColumns.push('actions');
    }

    this.getTooltipTexts();
    this.languageChangeSubscription =
      this.translateService.onLangChange.subscribe(() => {
        this.getTooltipTexts();
      });
  }

  ngAfterViewInit(): void {
    // Paginacion
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getTooltipTexts(): void {
    this.useTemplateTooltip = this.translateService.instant(
      'TOOLTIPS.USE_TEMPLATE'
    );
    this.deleteTemplateTooltip =
      this.translateService.instant('TOOLTIPS.DELETE');
    this.renameTemplateTooltip =
      this.translateService.instant('TOOLTIPS.RENAME');
    this.duplicateTemplateTooltip =
      this.translateService.instant('TOOLTIPS.DUPLICATE');
    this.filterTooltip = this.translateService.instant('TOOLTIPS.FILTER');
  }

  onPaginateChange(event: PageEvent): void {
    this.pageCurrent = event.pageIndex;
    this.paginateChange.emit(event);
  }

  onFilterInput(event: string): void {
    this.filterInput.emit(event);
  }

  isChecked(item: TypeFilterItem): boolean {
    const exists = this.filtersChips.some(x => x.key === item.key);
    return exists;
  }

  selectItem(key: string, item: TypeFilterItem): void {
    let localItem: any = null;

    localItem = this.getItemByKey(key, item);

    this.loadItemByKey(key, localItem);

    //Se agrega lista de chips
    this.loadChipsFilters(item);
  }

  getItemByKey(key: string, item: TypeFilterItem): any {
    //Busco lista por key
    const listByKey: TypeFilter = this.typeFilterList.find(
      data => data.key === key
    );

    //Busco dato de la lista por key
    const foundData: TypeFilterItem = listByKey.data.find(
      data => data.key === item.key
    );

    //Guardo nuevo dato
    return {
      key: key,
      name: '',
      data: foundData,
    };
  }

  loadItemByKey(key: string, localItem: any): void {
    //Busco si existe dato por key en filtrosSeleccionados 'TypeFilterItemsSelected'
    let foundIndexItem = this.typeFilterItemsSelected.findIndex(
      data => data.key === key
    );
    //Si no existe, creo un nuevo dato para esa key
    if (foundIndexItem < 0) {
      let data: TypeFilter = {
        key,
        name: '',
        data: [localItem.data],
      };
      this.typeFilterItemsSelected = [...this.typeFilterItemsSelected, data];
    } else {
      //Busco dato hijo por key. Si existe lo elimino, sino lo agrego.
      const indexFilterItem = this.typeFilterItemsSelected[
        foundIndexItem
      ].data.findIndex(data => {
        return data.key === localItem.data.key;
      });

      if (indexFilterItem > -1) {
        this.typeFilterItemsSelected[foundIndexItem].data.splice(
          indexFilterItem,
          1
        );
      } else {
        this.typeFilterItemsSelected[foundIndexItem].data.push(localItem.data);
      }
    }
  }

  loadChipsFilters(item: TypeFilterItem): void {
    const indexItem = this.filtersChips.findIndex(data => {
      return data.key === item.key;
    });

    if (indexItem > -1) {
      this.filtersChips.splice(indexItem, 1);
    } else {
      this.filtersChips.push(item);
    }
  }

  getParentItemIndex(itemRemove: TypeFilterItem): number {
    return this.typeFilterItemsSelected.findIndex(filterItem =>
      filterItem.data.find(child => child.key === itemRemove.key)
    );
  }

  showFilterView(): void {
    if (!this.showFilter) {
      this.showFilter = !this.showFilter;
    }
  }

  onFilter(): void {
    this.chipItems = [...this.filtersChips];
    this.showFilter = !this.showFilter;
    this.applyFilter();
  }

  removeChip(chipItem: TypeFilterItem, idx: number): void {
    //Busco indice al cual pertenece el chipItem
    const foundIndexItem = this.getParentItemIndex(chipItem);

    //Se elimina el chip de la lista de filtros seleccionados 'TypeFilterItemsSelected'
    this.deleteItemFilterFromChip(foundIndexItem, chipItem);

    //Se elimina chip de la lista de chipItems y se actualiza filtro de chips 'filterChips'
    this.updateChipsAndFilters(idx);

    //Se aplica filtro
    this.applyFilter();
  }

  deleteItemFilterFromChip(
    foundIndexItem: number,
    chipItem: TypeFilterItem
  ): void {
    const indexFilterItem = this.typeFilterItemsSelected[
      foundIndexItem
    ].data.findIndex(data => {
      return data.key === chipItem.key;
    });

    if (indexFilterItem > -1) {
      this.typeFilterItemsSelected[foundIndexItem].data.splice(
        indexFilterItem,
        1
      );
    }
  }

  updateChipsAndFilters(idx: number): void {
    this.chipItems.splice(idx, 1);
    this.filtersChips = [...this.chipItems];
  }

  applyFilter(): void {
    this.filters.emit(this.typeFilterItemsSelected);
  }

  reset(): void {
    this.chipItems = [];
    this.filtersChips = [];
    this.showFilter = !this.showFilter;
    this.typeFilterItemsSelected = [];
    this.applyFilter();
  }

  editReportSettings(element: GeneratedReport): void {
    this.editReportSettingEvent.emit(element);
  }

  deleteTemplate(element: GeneratedReport): void {
    this.deleteReportEvent.emit(element);
  }

  duplicateTemplate(element: GeneratedReport): void {
    this.duplicateReportEvent.emit(element);
  }
  renameTemplate(element: GeneratedReport): void {
    this.renameReportEvent.emit(element);
  }
}
