import { TypeFilter } from '../../mat-custom-individuals-table/models/type-filter.interface';
import { Aggrupation } from './aggrupation.interface';

export interface AggrupationOptions {
  aggrupation: Aggrupation;
  type: string;
  action: string;
  typeFilterList: TypeFilter[];
  selectedClientId: string;
}
