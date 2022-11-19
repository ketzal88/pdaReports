import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import {
  ReportsGroup,
  SelectedReport,
} from '../../../core/models/reportType.model';
import { ReportsLocal } from '../interfaces/reports-local.interface';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { unsubscribe } from '../../../core/utils/subscription.util';
import { StoreKeys } from 'src/app/core/consts/store-keys.enum';

@Component({
  selector: 'app-defaults',
  templateUrl: './defaults.component.html',
  styleUrls: ['./defaults.component.scss'],
})
export class DefaultsComponent implements OnInit, OnDestroy {
  //bindings
  reportGroupSelected: ReportsGroup = null;

  //Inputs
  @Input() reportsLocal: ReportsLocal[];
  @Input() typesReportsGroup: ReportsGroup[] = null;

  //Output
  @Output() preRedirect = new EventEmitter<boolean>();

  //Subscriptions
  reportsSub: Subscription;

  constructor(private router: Router, private storeService: StoreService) {}

  ngOnInit(): void {
    //TODO: Eliminar objeto json en cuanto se recupere contenido desde back
    const found = this.typesReportsGroup.find(
      data => data.internalName === 'EMOTIONAL_INTELLIGENCE'
    );
    if (!found) {
      this.typesReportsGroup.push({
        reportGroupId: '4fa85f64-5717-4562-b3fc-2c963f66a222',
        internalName: 'EMOTIONAL_INTELLIGENCE',
        name: 'EMOTIONAL_INTELLIGENCE',
        order: 4,
        reportTypes: [],
      });
    }
  }

  ngOnDestroy(): void {
    unsubscribe(this.reportsSub);
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

    this.preRedirect.emit(true);
    this.router.navigate(['/app/configuration']);
  }
}
