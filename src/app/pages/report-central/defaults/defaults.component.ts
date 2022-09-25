import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  ReportsGroup,
  SelectedReport,
} from '../../../core/models/reportType.model';
import {
  Reports,
  ReportsResponse,
} from '../../../core/services/microservices/reports/interfaces/reportsResponse.interface';
import { ReportGroupResponse } from '../../../core/services/microservices/reports/interfaces/reportGroupResponse.interface';
import { ReportType } from '../../../core/services/microservices/reports/interfaces/reportTypeResponse.interface';
import { ReportsLocal } from '../interfaces/reports-local.interface';
import { concat, Subscription, toArray } from 'rxjs';
import { Router } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { ReportsService } from '../../../core/services/microservices/reports/reports.service';
import { unsubscribe } from '../../../core/utils/subscription.util';
import { StoreKeys } from 'src/app/core/consts/store-keys.enum';

@Component({
  selector: 'app-defaults',
  templateUrl: './defaults.component.html',
  styleUrls: ['./defaults.component.scss'],
})
export class DefaultsComponent implements OnInit, OnDestroy {
  //bindings
  typesReportsGroup: ReportsGroup[] = null;
  reports: Reports[];
  reportTypes: ReportType[] = null;
  reportGroups: ReportGroupResponse[] = null;
  reportGroupSelected: ReportsGroup = null;
  selectedTabIndex: number;

  //Variables
  reportList: Reports[];
  reportsType: ReportType[];
  reportsLocal: ReportsLocal[];

  //Subscriptions
  reportsSub: Subscription;

  constructor(
    private router: Router,
    private storeService: StoreService,
    private reportsService: ReportsService
  ) {}

  ngOnInit(): void {
    this.selectedTabIndex = 0;
    this.initReports();
  }

  ngOnDestroy(): void {
    unsubscribe(this.reportsSub);
  }

  initReports(): void {
    this.reportsSub = concat(
      this.reportsService.getReports(),
      this.reportsService.getReportsType()
    )
      .pipe(toArray())
      .subscribe({
        next: (response: (ReportsResponse | ReportType[])[]) => {
          //Obtengo la lista de reportes
          this.reportList = response[0]['data'];
          //Obtengo la lista de tipos de reportes
          this.reportsType = <ReportType[]>response[1];

          //Armo lista de reportes a mostrar
          this.reportsLocal = this.getReportsLocal();
          this.loadListReports();
        },
        error: err => {
          console.log(
            'Error al obtener servicio de reports y tipos de reportes: ',
            err
          );
        },
        complete: () => {},
      });
  }

  getReportsLocal(): ReportsLocal[] {
    this.reportsLocal = this.reportList
      .filter((data: Reports) => data.reportTypeId !== null)
      .map((data: Reports) => {
        return {
          reportId: data.reportId,
          businessUnitId: data.businessUnitId,
          baseId: data.baseId,
          subbaseId: data.subbaseId,
          productTypeId: data.productTypeId,
          creationDate: data.creationDate,
          name: data.name,
          description: data.description,
          html_MasterPage: data.html_MasterPage,
          html_Cover: data.html_Cover,
          html_Header: data.html_Header,
          html_Footer: data.html_Footer,
          css_Url: data.css_Url,
          reportType: {
            id: data.reportTypeId,
            internalName: null,
            name: null,
          },
          reportGroup: {
            id: null,
            internalName: null,
            name: null,
          },
        };
      });

    this.reportsLocal = this.reportsLocal.map(report => {
      //Seteo tipo de reporte
      const reportTypeLocal = this.reportsType
        .filter(reportType => reportType.id === report.reportType.id)
        .map(data => {
          return {
            id: data.id,
            internalName: data.internallName,
            name: data.name,
          };
        })[0];
      report.reportType = reportTypeLocal;

      //Seteo tipo de grupo
      const reportGroupLocal = this.reportsType
        .filter(reportType => reportType.id === report.reportType.id)
        .map(data => {
          return {
            id: data.reportGroup.id,
            internalName: data.reportGroup.internalName,
            name: data.reportGroup.name,
          };
        })[0];
      report.reportGroup = reportGroupLocal;
      return report;
    });
    return this.reportsLocal;
  }

  loadListReports(): void {
    //Filtro los grupos que sean distintos
    const groupList = this.reportsLocal.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          value =>
            value.reportGroup.internalName === item.reportGroup.internalName &&
            value.reportGroup.id === item.reportGroup.id
        )
    );

    //Creo lista de reportes
    let listReport: ReportsGroup[] = groupList.map(data => {
      let order = this.getOrderByGroup(data.reportGroup.internalName);

      return {
        reportGroupId: data.reportGroup.id,
        internalName: data.reportGroup.internalName,
        name: data.reportGroup.name,
        order,
        reportTypes: [],
      };
    });

    //Se ordena segun orden de disenio
    listReport = this.sortByOrder(listReport, 'order');
    //Filtro y completo items faltantes
    this.typesReportsGroup = listReport.map((itemReport, i) => {
      let currentReports = this.reportsLocal
        .filter(item => item.reportGroup.id === itemReport.reportGroupId)
        .map(data => {
          let order = this.getOrderByTypeReport(data.reportType.internalName);

          return {
            id: data.reportType.id,
            internalName: data.reportType.internalName,
            name: data.reportType.name,
            order,
          };
        });
      currentReports = this.sortByOrder(currentReports, 'order');
      itemReport.reportTypes = currentReports;
      return itemReport;
    });
  }

  getOrderByGroup(internalName: string): number {
    let order: number;
    switch (internalName) {
      case 'HIRING':
        order = 1;
        break;
      case 'DEVELOPMENT':
        order = 2;
        break;
      case 'SALES':
        order = 3;
        break;
      default:
        order = 4;
        break;
    }

    return order;
  }

  getOrderByTypeReport(internalName: string): number {
    let order: number;

    if (internalName.includes('SURVEY')) {
      order = 1;
    } else if (internalName.includes('REPORT')) {
      order = 2;
    } else if (internalName.includes('CANDIDATE_REVIEW')) {
      order = 3;
    } else {
      order = 4;
    }

    return order;
  }

  sortByOrder<K extends string, T extends Record<K, number>>(
    items: T[],
    dateFieldName: K
  ): T[] {
    return items.sort((a: T, b: T) => a[dateFieldName] - b[dateFieldName]);
  }

  setGroupSelection(reportGroup: ReportsGroup): void {
    this.reportGroupSelected = reportGroup;
  }

  goToConfiguration(reportGroup: ReportsGroup, internalName: string): void {
    let selectedReport: SelectedReport = {
      reportGroup: {
        id: reportGroup.reportGroupId,
        internalName: reportGroup.internalName,
        name: reportGroup.name,
        order: reportGroup.order,
      },
      reportType: null,
    };

    selectedReport.reportType = reportGroup.reportTypes.filter(
      data => data.internalName === internalName
    )[0];

    //Busco reportId filtrando por reportGroupId y reportTypeId
    selectedReport.reportId = this.reportsLocal.find(
      data =>
        data.reportGroup.id === selectedReport.reportGroup.id &&
        data.reportType.id === selectedReport.reportType.id
    ).reportId;
    this.storeService.setData(
      StoreKeys.TYPE_REPORT,
      JSON.stringify(selectedReport)
    );
    this.router.navigate(['/app/configuration']);
  }
}
