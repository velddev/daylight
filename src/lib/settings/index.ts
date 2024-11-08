import { PinType } from "../../components/icon-pin";
import { createLogger } from "../logger";
import { ChromeStorageAdapter } from "./chrome-storage-adapter";
import { LocalStorageAdapter } from "./local-storage-adapter";
import { IStorageAdapter } from "./types";

export type BackgroundAsset =
  | {
      id: string;
      type: "image" | "video";
      url?: string;
    }
  | {
      id: string;
      type: "color";
      hex: string;
    };

type SettingsType = {
  background: {
    selectedAssetId: string;
    savedAssets: BackgroundAsset[];
  };
  keys: {
    openai: string | null;
  };
  pins: PinType[];
};

const defaultSettings: SettingsType = {
  background: {
    selectedAssetId: "preload",
    savedAssets: [
      {
        type: "image",
        url: "https://i.pinimg.com/originals/b9/74/a4/b974a440d9d9742a41f2fb35db1247af.jpg",
        id: "preload",
      },
    ],
  },
  keys: {
    openai: null,
  },
  pins: [
    { type: "twitter", url: "https://twitter.com" },
    { type: "bluesky", url: "https://bluesky.com" },
    { type: "youtube", url: "https://youtube.com" },
  ],
};

const logger = createLogger("settings");

export class SettingsManager extends EventTarget {
  public assetDatabase: AssetDatabase;

  constructor(
    private settings: SettingsType = defaultSettings,
    private storageAdapter: IStorageAdapter = resolveStorageAdapter()
  ) {
    super();

    this.assetDatabase = new AssetDatabase();
  }

  get background() {
    return (
      this.settings.background.savedAssets.find(
        (x) => x.id === this.settings.background.selectedAssetId
      ) ?? null
    );
  }

  get backgrounds() {
    return this.settings.background.savedAssets;
  }

  get keys() {
    return this.settings.keys;
  }

  get pins() {
    return this.settings.pins;
  }

  addBackground(asset: BackgroundAsset) {
    this.settings.background.savedAssets.push(asset);
    logger.debug("add background", asset);
    this.save();
  }

  addKey(provider: keyof SettingsType["keys"], key: string) {
    this.settings.keys[provider] = key;
    this.save();
  }

  addPin(pin: PinType) {
    this.settings.pins.push(pin);
    this.save();
  }

  removePin(index: number) {
    this.settings.pins.splice(index, 1);
    this.save();
  }

  setCurrentBackground(id: string) {
    this.settings.background.selectedAssetId = id;
    logger.debug("set current background", id);
    this.save();
  }

  async save() {
    await this.storageAdapter.set("settings", this.settings);
    this.dispatchEvent(new Event("save"));
  }

  async init() {
    await this.assetDatabase.init();
    this.verifyIntegrity();
  }

  private verifyIntegrity() {
    let hadIssues = false;

    if (!this.settings) {
      console.error("Settings not found, using default settings");
      this.settings = defaultSettings;
      hadIssues = true;
    }

    if (!this.settings.background) {
      console.error("Background not found, using default settings");
      this.settings.background = defaultSettings.background;
      hadIssues = true;
    }

    if (!this.settings.background.savedAssets) {
      console.error("Saved assets not found, using default settings");
      this.settings.background.savedAssets =
        defaultSettings.background.savedAssets;
      hadIssues = true;
    }

    if (!this.settings.keys) {
      console.error("Keys not found, using default settings");
      this.settings.keys = defaultSettings.keys;
      hadIssues = true;
    }

    if (!this.settings.pins) {
      console.error("Pins not found, using default settings");
      this.settings.pins = defaultSettings.pins;
      hadIssues = true;
    }

    if (hadIssues) {
      logger.debug("reset settings...");
      this.storageAdapter.reset();
      this.save();
    }
  }
}

export class AssetDatabase {
  db: IDBDatabase | null = null;

  constructor() {}

  async init() {
    return new Promise<void>((resolve) => {
      const request = indexedDB.open("Assets", 1);

      request.onupgradeneeded = (event) => {
        // @ts-ignore
        this.db = event.target.result as unknown as IDBDatabase;
        if (!this.db.objectStoreNames.contains("assets")) {
          this.db.createObjectStore("assets", { keyPath: "id" });
        }
      };

      request.onsuccess = (event) => {
        // @ts-ignore
        this.db = event.target.result as unknown as IDBDatabase;
        logger.debug("Database opened successfully");
        resolve();
      };

      request.onerror = (event) => {
        // @ts-ignore
        logger.error("Database error:", event.target.error);
      };
    });
  }

  async getAssetById(id: string): Promise<File | null> {
    if (!this.db) {
      return null;
    }

    const transaction = this.db.transaction("assets", "readonly");
    const store = transaction.objectStore("assets");
    const request = store.get(id);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve(request.result.asset);
      };

      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async putAsset(id: string, asset: File) {
    if (!this.db) {
      return;
    }

    // file to data url
    const reader = new FileReader();
    reader.readAsDataURL(asset);

    reader.onload = () => {
      const transaction = this.db!.transaction("assets", "readwrite");
      const store = transaction.objectStore("assets");
      store.put({ id, asset });
    };
  }
}

let singleton: SettingsManager | null = null;

export const createSettings = async (): Promise<SettingsManager> => {
  if (singleton) {
    return singleton;
  }

  const storageAdapter = resolveStorageAdapter();

  const settings = await storageAdapter.get("settings");
  const instance = new SettingsManager(settings as SettingsType);

  singleton = instance;
  return instance;
};

const resolveStorageAdapter = (): IStorageAdapter => {
  if (chrome.storage) {
    return new ChromeStorageAdapter();
  }

  logger.debug("no access to chrome storage, falling back to LocalStorage");
  return new LocalStorageAdapter();
};
