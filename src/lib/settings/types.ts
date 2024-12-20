export interface IStorageAdapter {
  get(key: string): Promise<any>;
  set(key: string, value: any): Promise<void>;
  reset: () => void;
}
