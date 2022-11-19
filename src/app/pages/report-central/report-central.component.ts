import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { ReportsService } from '../../core/services/microservices/reports/reports.service';
import { Reports } from '../../core/services/microservices/reports/interfaces/reportsResponse.interface';
import { ReportType } from '../../core/services/microservices/reports/interfaces/reportTypeResponse.interface';
import { ReportsGroup } from '../../core/models/reportType.model';
import { ReportsLocal } from './interfaces/reports-local.interface';
import { unsubscribe } from '../../core/utils/subscription.util';
import { StoreService } from '../../core/services/store.service';
import { StoreKeys } from '../../core/consts/store-keys.enum';
import { LoadingService } from '../../core/services/loading.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-report-central',
  templateUrl: './report-central.component.html',
  styleUrls: ['./report-central.component.scss'],
})
export class ReportCentralComponent implements OnInit, OnDestroy {
  //bindings
  selectedTabIndex: number;
  typesReportsGroup: ReportsGroup[] = null;

  //Variables
  reportList: Reports[];
  reportsType: ReportType[];
  reportsLocal: ReportsLocal[];

  //Subscriptions
  reportsSub: Subscription;

  constructor(
    private reportsService: ReportsService,
    private storeService: StoreService,
    private loadingService: LoadingService,
    private translateService: TranslateService
  ) {
    this.loadingService.setMessage('');
  }

  ngOnInit(): void {
    this.selectedTabIndex = 0;
    this.initReports();
  }

  ngOnDestroy(): void {
    unsubscribe(this.reportsSub);
  }

  onTabChanged($event): void {
    this.selectedTabIndex = $event.index;
  }

  initReports(): void {
    this.reportsSub = this.reportsService.getReportsLocal().subscribe({
      next: (response: ReportsLocal[]) => {
        this.reportsLocal = response;
        this.loadListReports();
      },
      error: err => {
        console.log(
          this.translateService.instant('REPORTING_CENTER.ERROR_TYPES_REPORTS'),
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
            internalName: data.internalName,
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
    this.reportsLocal = this.reportsLocal.filter(x => x.reportTypeId !== null);
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
    this.typesReportsGroup = listReport.map(itemReport => {
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

    this.storeService.setData(
      StoreKeys.TYPES_REPORTS_GROUP,
      this.typesReportsGroup
    );
    this.storeService.setData(StoreKeys.REPORTS_LOCAL, this.reportsLocal);
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
}
