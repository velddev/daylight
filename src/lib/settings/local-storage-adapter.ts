import { IStorageAdapter } from "./types";

export class LocalStorageAdapter implements IStorageAdapter {
  async get(key: string) {
    return JSON.parse(localStorage.getItem(key) || "null");
  }

  async set(key: string, value: any) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  reset() {
    localStorage.clear();
  }
}
