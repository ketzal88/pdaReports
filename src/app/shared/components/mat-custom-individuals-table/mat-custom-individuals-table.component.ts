import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { SelectItem } from './models/select-item.interface';
import { TableColumn } from './models/tableColumn.interface';
import { TypeFilterItem } from './models/type-filter-item.interface';
import { TypeFilter } from './models/type-filter.interface';
import {
  Consistency,
  VwGetAllIndividualWithBehaviouralProfile,
} from '../../../core/services/microservices/individual/individual.interface';

@Component({
  selector: 'app-mat-custom-individuals-table',
  templateUrl: './mat-custom-individuals-table.component.html',
  styleUrls: ['./mat-custom-individuals-table.component.scss'],
})
export class MatCustomIndividualsTableComponent
  implements OnInit, AfterViewInit
{
  //Bindings
  displayedColumns: string[] = [];
  //valueInput: string;
  //checkedLeader = false;
  disabledLeader = false;
  showFilter: boolean = false;
  selectedItem: SelectItem = {
    checked: false,
    idx: null,
    pageIndex: 0,
  };

  selectedLeaderId?: string;
  pageCurrent: number = 0;

  selectedIndividual: string;

  filtersChips: TypeFilterItem[] = [];
  chipItems: TypeFilterItem[] = [];

  typeFilterItemsSelected: TypeFilter[] = [];

  //Viewchilds
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<any>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  //Inputs
  @Input() columns: Array<TableColumn>;
  @Input() hasSelectLeader: boolean = false;
  @Input() hasSelect: boolean;
  @Input() totalSize: number = 0;
  @Input()
  dataSource: MatTableDataSource<VwGetAllIndividualWithBehaviouralProfile>;
  @Input() typeFilterList!: TypeFilter[];
  @Input() lockedSelectId?: string;
  @Input() selectedIds: string[] = [];
  @Input() multipleSelection: boolean = false;
  @Input() maxMultipleSelection: number = 100;
  @Input() preselectedIds: string[];

  //Outputs
  @Output() paginateChange: EventEmitter<PageEvent> =
    new EventEmitter<PageEvent>();
  @Output() selectedIndividualsEvent: EventEmitter<any> =
    new EventEmitter<any>();
  @Output() filterInput: EventEmitter<string> = new EventEmitter<string>();
  @Output() filters: EventEmitter<TypeFilter[]> = new EventEmitter<
    TypeFilter[]
  >();
  @Output() selectedLeaderIdEvent: EventEmitter<string | null> =
    new EventEmitter<string | null>();

  //Paginator
  pageSizeOptions: number[] = [5, 10, 25, 50];
  @Input() pageSize: number = 10;

  constructor() {}

  ngOnInit(): void {
    if (this.selectedIds === undefined) {
      this.selectedIds = [];
    }

    this.loadPreselectedIds();

    // Se agrega de forma opcional la columna de checkbox
    if (this.hasSelect) {
      this.displayedColumns.push('select');
    }

    // Se agrega columnas para mostrar los datos
    this.displayedColumns = this.displayedColumns.concat(
      this.columns.map(x => x.columnDef)
    );

    // De forma opcional se agrega la columna leader
    if (this.hasSelectLeader) {
      this.displayedColumns.push('leader');
    }
  }

  ngAfterViewInit(): void {
    // Paginacion
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadPreselectedIds(): void {
    if (this.preselectedIds) {
      this.selectedIds = [...this.selectedIds, ...this.preselectedIds];
    }
  }

  onPaginateChange(event: PageEvent): void {
    this.pageCurrent = event.pageIndex;
    this.paginateChange.emit(event);
  }

  onFilterInput(event: string): void {
    this.filterInput.emit(event);
  }

  isDisabled(row: any): boolean {
    if (row.individualId === this.lockedSelectId) {
      return true;
    } else if (this.multipleSelection) {
      let selectedIdsLocal = [...this.selectedIds];

      if (
        row.individualId !== this.selectedLeaderId &&
        this.multipleSelection &&
        (this.selectedIds.length >= this.maxMultipleSelection ||
          selectedIdsLocal.length >= this.maxMultipleSelection) &&
        this.selectedIds.indexOf(row.individualId) === -1
      ) {
        return true;
      }

      return this.isValidByState(row);
    } else {
      return this.isValidByState(row);
    }
  }

  isValidByState(row: any): boolean {
    return (
      row.consistencyEnum === Consistency.Invalid ||
      row.consistencyEnum === Consistency.NotAvalaible
    );
  }

  isDisabledLeader(row: any): boolean {
    return (
      row.consistencyEnum === Consistency.Invalid ||
      row.consistencyEnum === Consistency.NotAvalaible
    );
  }

  selectIndividual(
    itemCheck: boolean,
    idx: number,
    row: VwGetAllIndividualWithBehaviouralProfile
  ): void {
    if (!this.multipleSelection) {
      this.selectedIndividual =
        this.selectedIndividual !== row.individualId ? row.individualId : null;
      const individualIds = this.selectedIndividual
        ? [this.selectedIndividual]
        : [];
      this.selectedIds = individualIds;
      this.selectedIndividualsEvent.emit(individualIds);
    } else {
      const individualIndex = this.selectedIds.indexOf(row.individualId);
      if (individualIndex === -1 && itemCheck) {
        this.selectedIds.push(row.individualId);
      } else if (individualIndex !== -1) {
        this.selectedIds.splice(individualIndex, 1);
      }
      if (row.individualId === this.selectedLeaderId && !itemCheck) {
        this.selectedLeaderId = null;
        this.selectedLeaderIdEvent.emit(this.selectedLeaderId);
      }
      this.selectedIndividualsEvent.emit(this.selectedIds);
    }
  }

  selectLeader(
    element: VwGetAllIndividualWithBehaviouralProfile,
    checked: boolean
  ): void {
    if (element) {
      //Selecciono leaderId
      if (!checked) {
        this.selectedLeaderId = null;
      } else {
        this.selectedLeaderId = element.individualId;
      }

      this.selectedLeaderIdEvent.emit(this.selectedLeaderId);
    }
  }

  getSelectIndividual(itemCheck: boolean, idx: number): SelectItem {
    let selectedCheck: SelectItem = {
      checked: itemCheck,
      idx,
      pageIndex: this.pageCurrent,
    };
    return selectedCheck;
  }

  isFilterChipChecked(item: TypeFilterItem): boolean {
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

  checkStatus(row: VwGetAllIndividualWithBehaviouralProfile): boolean {
    return (
      this.lockedSelectId === row.individualId ||
      this.selectedLeaderId === row.individualId ||
      this.selectedIds.indexOf(row.individualId) > -1 ||
      row.individualId === this.selectedIndividual
    );
  }
}
