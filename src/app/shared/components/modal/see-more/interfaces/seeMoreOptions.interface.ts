import { SeeMoreData } from './seeMoreData.interface';
export class SeeMoreOptions {
  data: SeeMoreData;
  width?: string;
  panelClass?: string;
  closeOnNavigation?: boolean;

  constructor() {
    this.closeOnNavigation = true;
  }
}
