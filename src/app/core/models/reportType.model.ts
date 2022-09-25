export interface ReportsGroup {
  reportGroupId: string;
  internalName: string;
  name: string;
  order: number;
  reportTypes: ItemReport[];
}

export interface SelectedReport {
  reportId?: string;
  reportGroup?: ItemReport;
  reportType: ItemReport;
}

export interface ItemReport {
  id: string;
  internalName: string;
  name: string;
  order: number;
}
