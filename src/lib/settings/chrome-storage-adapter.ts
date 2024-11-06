import { IStorageAdapter } from "./types";

export class ChromeStorageAdapter implements IStorageAdapter {
  async get(key: string) {
    return new Promise((resolve) => {
      chrome.storage.sync.get(key, (value) => {
        resolve(value[key]);
      });
    });
  }

  async set(key: string, value: any) {
    return new Promise<void>((resolve) => {
      chrome.storage.sync.set({ [key]: value }, () => {
        resolve();
      });
    });
  }

  reset() {
    chrome.storage.sync.clear();
  }
}
