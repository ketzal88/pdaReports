export interface ReportType {
  id: string;
  internalName: string;
  name: string;
  reportGroupId: string;
  reportGroup: ReportGroup;
}

export interface ReportGroup {
  id: string;
  internalName: string;
  name: string;
}
