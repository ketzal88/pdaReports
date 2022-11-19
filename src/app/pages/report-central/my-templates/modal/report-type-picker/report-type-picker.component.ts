import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StoreKeys } from 'src/app/core/consts/store-keys.enum';
import { ReportsGroup } from 'src/app/core/models/reportType.model';
import { StoreService } from 'src/app/core/services/store.service';
import { ReportsLocal } from '../../../interfaces/reports-local.interface';
import { TemplateConfiguration } from '../../../configuration/interfaces/template-configuration.interface';

@Component({
  selector: 'app-report-type-picker',
  templateUrl: './report-type-picker.component.html',
  styleUrls: ['./report-type-picker.component.scss'],
})
export class ReportTypePickerComponent implements OnInit, OnDestroy {
  //Variables
  reportsLocal: ReportsLocal[];
  typesReportsGroup: ReportsGroup[] = null;

  constructor(
    private storeService: StoreService,
    public dialogRef: MatDialogRef<ReportTypePickerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.typesReportsGroup = this.storeService.getData(
      StoreKeys.TYPES_REPORTS_GROUP
    );
    this.reportsLocal = this.storeService.getData(StoreKeys.REPORTS_LOCAL);
  }

  onRedirect(): void {
    const templateConfiguration: TemplateConfiguration = {
      isTemplate: true,
      templateCreation: true,
    };

    this.storeService.setData(
      StoreKeys.REPORT_TEMPLATE_CONFIGURATION,
      templateConfiguration
    );
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    this.dialogRef.close();
  }
}
