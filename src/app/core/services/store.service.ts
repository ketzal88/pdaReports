import { Injectable } from '@angular/core';

@Injectable()
export class StoreService {
  private data = new Map<string, any>();

  constructor() {}

  getData(key: string): any {
    return this.data.get(key);
  }

  setData(key: string, value: any): void {
    this.data.set(key, value);
  }

  clearValue(key: string): void {
    if (this.getData(key)) {
      this.data.delete(key);
    }
  }

  clearAll(): void {
    this.data.clear();
  }

  clearValueByList(dataList: string[]): void {
    for (let i = 0; i < dataList.length; i++) {
      this.clearValue(dataList[i]);
    }
  }
}
