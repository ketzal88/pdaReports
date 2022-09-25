import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class DataProviderService {
  constructor() {}

  // Observable string stream
  private dataSetChangeSource = new Subject<string>();

  // Observable string stream
  dataSetChanged$ = this.dataSetChangeSource.asObservable();

  private data_: Array<Object> = [
    {
      customName: 'Name1',
      customValue1: 10,
      customValue2: 12,
      customValue3: 7,
    },
    {
      customName: 'Name2',
      customValue1: 14,
      customValue2: 10,
      customValue3: 17,
    },
    {
      customName: 'Name3',
      customValue1: 21,
      customValue2: 4,
      customValue3: 15,
    },
  ];

  private dataSet_: anychart.data.Set = anychart.data.set(this.data_);

  private mappings_: { [key: string]: anychart.data.View } = {
    data1: this.dataSet_.mapAs({ x: ['customName'], value: ['customValue1'] }),
    data2: this.dataSet_.mapAs({ x: ['customName'], value: ['customValue2'] }),
    data3: this.dataSet_.mapAs({ x: ['customName'], value: ['customValue3'] }),
  };

  getDataList(): string[] {
    const res: Array<string> = [];
    for (const key in this.mappings_) {
      if (this.mappings_.hasOwnProperty(key)) {
        res.push(key);
      }
    }
    return res;
  }

  getData(key: string = 'data1'): anychart.data.View {
    return this.mappings_[key];
  }

  setCurrentDataSet(key: string = 'data1'): void {
    this.dataSetChangeSource.next(key);
  }
}
