import { ChangeEvent, useRef, useState } from "react";
import { useSettings } from "../providers/SettingsProvider";
import { BackgroundAsset } from "../lib/settings";
import { CloseIcon, TrashIcon } from "./icons";
import { twMerge } from "tailwind-merge";
import { pinIcons } from "./icon-pin";

type SettingsDrawerProps = {
  isOpen: boolean;
  onClose: () => void;
};

export const SettingsDrawer = ({ isOpen, onClose }: SettingsDrawerProps) => {
  const settings = useSettings();
  if (!settings) return null;

  return (
    <div
      className={`fixed text-white inset-y-0 right-0 w-96 p-4 m-2 rounded-md bg-black/40 backdrop-blur-sm flex flex-col gap-8 transition-all duration-300 ${
        isOpen ? "" : "translate-x-[120%]"
      }`}
    >
      <div className="flex w-full justify-between items-center">
        <h1 className="text-xl font-semibold">Settings</h1>
        <button className="h-5 aspect-square" onClick={onClose}>
          <CloseIcon />
        </button>
      </div>
      <BackgroundSection />
      <PinSection />
      <KeysSection />
      <p className="text-xs text-white/40">
        copyright Veld Labs LLC, 2024, all rights reserved.
      </p>
    </div>
  );
};

const BackgroundSection = () => {
  const settings = useSettings()!;
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
    settings.addBackground(asset);
  }

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Background</h2>
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

const PinSection = () => {
  const settings = useSettings()!;
  const [type, setType] = useState<keyof typeof pinIcons>("globe");
  const [url, setUrl] = useState<string>("");

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Pins</h2>
      <p className="text-xs text-white/60">
        Pins are quick links to your favorite websites. They will be displayed
        on the bottom of the screen.
      </p>
      <table className="border border-white/20 rounded-sm">
        <tbody>
          {settings.pins.map((pin, index) => (
            <tr className={twMerge("px-2", index % 2 === 1 && "bg-white/5")}>
              <td key={pin.type + "-" + index} className="p-1 pl-2">
                <p>{pin.type}</p>
              </td>
              <td key={pin.url + "-" + index} className="p-1">
                <p>{pin.url}</p>
              </td>
              <td key={"del-" + index} className="flex w-full p-1 justify-end">
                <button
                  className="bg-white/10 rounded-md aspect-square p-2"
                  onClick={() => {
                    settings.removePin(index);
                  }}
                >
                  <TrashIcon className="h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <select
        className="bg-white/20 rounded-md px-2 py-1"
        value={type}
        onChange={(e) => setType(e.target.value as keyof typeof pinIcons)}
      >
        {Object.keys(pinIcons).map((type) => (
          <option key={type} value={type} className="bg-neutral-500">
            {type}
          </option>
        ))}
      </select>
      <input
        className="bg-white/20 rounded-md px-2 py-1 placeholder:text-white/40"
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <button
        className="bg-blue-500 rounded-md py-1"
        onClick={() => {
          settings.addPin({
            type,
            url,
          });
        }}
      >
        Add
      </button>
    </section>
  );
};

const KeysSection = () => {
  const settings = useSettings()!;

  const [openaiKey, setOpenaiKey] = useState<string>(
    settings.keys.openai ?? ""
  );

  return (
    <section className="flex flex-col gap-2">
      <h2 className="text-lg font-semibold">Keys</h2>
      <p className="text-sm text-white/80">
        All keys are stored locally inside of your chrome. We do not share keys
        with anyone.
      </p>

      <h3>OpenAI</h3>
      <p className="text-xs text-white/60">
        This key is used to enable our AI-driven search hints. It is optional
        whether you want to use it or not.
      </p>
      <input
        className="bg-white/20 rounded-md px-2 py-1 placeholder:text-white/40"
        placeholder="OpenAI API Key"
        value={openaiKey}
        onChange={(e) => {
          if (!settings) return;
          setOpenaiKey(e.target.value);
        }}
      />
      <p className="text-sm text-white/80">
        You can create an API key on{" "}
        <a className="underline" href="https://platform.openai.com">
          platform.openai.com
        </a>
      </p>
      <button
        className="bg-blue-500 rounded-md py-1"
        onClick={() => {
          if (!settings) return;
          settings.addKey("openai", openaiKey);
        }}
      >
        Save
      </button>
    </section>
  );
};
