import { ChangeEvent, useRef } from "react";
import { useSettings } from "../providers/SettingsProvider";
import { BackgroundAsset } from "../lib/settings";
import { CloseIcon } from "./icons";

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  return (
    <div
      className={`fixed text-white inset-y-0 right-0 w-96 p-4 m-2 rounded-md bg-black/40 backdrop-blur-sm flex flex-col gap-4 transition-all duration-300 ${
        isOpen ? "" : "translate-x-[100%]"
      }`}
    >
      <div className="flex w-full justify-between items-center">
        <h1 className="text-lg">Settings</h1>
        <button className="h-5 aspect-square" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <hr />
      <BackgroundSection />
      <p className="text-xs text-white/40">
        copyright Veld Labs LLC, 2024, all rights reserved.
      </p>
    </div>
  );
};

const BackgroundSection = () => {
  const settings = useSettings();
  const uploadAssetRef = useRef<HTMLInputElement>(null);

  async function uploadAsset(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name;

    await settings?.assetDatabase.putAsset(fileName, file);

    const type = file.type.split("/")[0] as "image" | "video";

    const asset: BackgroundAsset = {
      type,
      id: fileName,
    };
    settings?.addBackground(asset);
  }

  return (
    <section className="flex flex-col gap-2">
      <h2>Background</h2>
      <select
        className="bg-white/20 rounded-md px-2 py-1"
        value={settings?.background?.id}
        onChange={(e) => {
          if (!settings) return;
          settings.setCurrentBackground(e.target.value!);
        }}
      >
        {settings?.backgrounds.map((asset) => (
          <option key={asset.id} value={asset.id} className="bg-neutral-500">
            {asset.id}
          </option>
        ))}
      </select>
      <button
        className="w-full bg-blue-500 rounded-md py-1"
        onClick={() => {
          uploadAssetRef.current?.click();
        }}
      >
        Add New
      </button>
      <input
        type="file"
        ref={uploadAssetRef}
        onChange={uploadAsset}
        className="hidden"
      />
    </section>
  );
};
