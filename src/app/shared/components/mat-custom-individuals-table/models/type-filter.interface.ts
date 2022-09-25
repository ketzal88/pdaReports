import { TypeFilterItem } from './type-filter-item.interface';

export interface TypeFilter {
  key: string;
  name: string;
  data: TypeFilterItem[];
}
