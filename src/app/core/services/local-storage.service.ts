import { Injectable } from '@angular/core';

function getLocalStorage(): Storage {
  return localStorage;
}

@Injectable()
export class LocalStorageService {
  constructor() {}

  get localStorage(): Storage {
    return getLocalStorage();
  }

  setValue(key: string, value: string): void {
    this.localStorage.setItem(key, value);
  }

  getValue(key: string): string {
    if (key !== null) {
      return this.localStorage.getItem(key);
    }
    return null;
  }

  clearValue(key: string): void {
    this.localStorage.removeItem(key);
  }

  clearAllLocalStorage(): void {
    this.localStorage.clear();
  }
}
