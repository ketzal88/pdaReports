export interface TypeBehavioralItem {
  individualId: string;
  name: string;
  shortName: string;
  value: number;
  selected: boolean;
}

export interface TypeBehavioral {
  type: string;
  name: string;
  tooltip: string;
  data: TypeBehavioralItem[];
}
