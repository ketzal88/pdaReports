import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { StoreService } from '../../../../core/services/store.service';
import { SelectionModel } from '@angular/cdk/collections';
import { TypeFilterItem } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter-item.interface';
import { TypeFilter } from '../../../../shared/components/mat-custom-individuals-table/models/type-filter.interface';
import { SelectItem } from '../../../../shared/components/mat-custom-individuals-table/models/select-item.interface';
import { TableColumn } from '../../../../shared/components/mat-custom-individuals-table/models/tableColumn.interface';
import { GeneratedReport } from '../../../../core/services/microservices/reports/interfaces/generatedReportsResponse.interface';

@Component({
  selector: 'app-table-my-reports',
  templateUrl: './table-my-reports.component.html',
  styleUrls: ['./table-my-reports.component.scss'],
})
export class TableMyReportsComponent implements OnInit, AfterViewInit {
  //Bindings
  displayedColumns: string[] = [];
  valueInput: string;
  checkedLeader = false;
  disabledLeader = false;
  showFilter: boolean = false;
  selectedReport: GeneratedReport[];

  pageCurrent: number = 0;

  filtersChips: TypeFilterItem[] = [];
  chipItems: TypeFilterItem[] = [];

  typeFilterItemsSelected: TypeFilter[] = [];

  selection = new SelectionModel<GeneratedReport>(true, []);

  //Viewchilds
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //Inputs
  @Input() columns: Array<TableColumn>;
  @Input() hasSelectActions: boolean = false;
  @Input() hasSelect: boolean = true;
  @Input() totalSize: number = 0;
  @Input() dataSource: MatTableDataSource<any>;
  @Input() typeFilterList!: TypeFilter[];

  @Input() parentType: string = 'Individual';

  //Outputs
  @Output() paginateChange: EventEmitter<PageEvent> =
    new EventEmitter<PageEvent>();
  @Output() selectedChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() filterInput: EventEmitter<string> = new EventEmitter<string>();
  @Output() filters: EventEmitter<TypeFilter[]> = new EventEmitter<
    TypeFilter[]
  >();
  @Output() selectedChangeLeader: EventEmitter<number> =
    new EventEmitter<number>();

  @Output() sendReportEvent: EventEmitter<boolean> =
    new EventEmitter<boolean>();

  //Paginator
  pageSizeOptions: number[] = [5, 10, 25, 50];
  pageSize: number = 10;
  //TODO: ESTE PAGESIZE DEBE SER UN INPUT PARA QUE SE PUEDA ELEGIR DESDE EL COMPONENTE EL PAGINADO INCIAL.

  constructor(private storeService: StoreService) {}

  ngOnInit(): void {
    // Se agrega de forma opcional la columna de checkbox
    if (this.hasSelect) {
      this.displayedColumns.push('select');
    }

    // Se agrega columnas para mostrar los datos
    this.displayedColumns = this.displayedColumns.concat(
      this.columns.map(x => x.columnDef)
    );

    // De forma opcional se agrega la columna leader
    if (this.hasSelectActions) {
      this.displayedColumns.push('actions');
    }
  }

  ngAfterViewInit(): void {
    // Paginacion
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onPaginateChange(event: PageEvent): void {
    this.pageCurrent = event.pageIndex;
    this.paginateChange.emit(event);
  }

  onFilterInput(event: string): void {
    this.filterInput.emit(event);
  }

  getSelectPerson(itemCheck: boolean, idx: number): SelectItem {
    let selectedCheck: SelectItem = {
      checked: itemCheck,
      idx,
      pageIndex: this.pageCurrent,
    };
    return selectedCheck;
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
  }

  sendReportIndividual(element: GeneratedReport): void {
    this.selectedReport = this.selection.selected.filter(
      (data: any) => data.individualId === element.individualId
    );

    this.sendReport();
  }

  sendReportMultiple(): void {
    this.selectedReport = [];
    this.sendReport();
  }
  sendReport(): void {
    this.selectedChange.emit(
      this.selectedReport.length === 1
        ? this.selectedReport
        : this.selection.selected
    );
    this.sendReportEvent.emit(true);
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }
}
