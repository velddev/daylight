import { useEffect, useState } from "react";
import { useSettings } from "../../providers/SettingsProvider";
import { BackgroundAssetWithUrl } from "./types";

let preloadedAsset: BackgroundAssetWithUrl | null = null;
const assetData = localStorage.getItem("bg:asset");
if (assetData) {
  preloadedAsset = JSON.parse(assetData);
}

export const useBackground = (): BackgroundAssetWithUrl | null => {
  const settings = useSettings();
  const [asset, setAsset] = useState<BackgroundAssetWithUrl | null>(
    preloadedAsset
  );

  useEffect(() => {
    if (!settings) return;

    const asset = settings.background;
    if (!asset) return;

    if (asset.type !== "color") {
      if (asset.url) {
        setAsset({ ...asset, url: asset.url });
        return;
      }
    } else {
      return;
    }

    settings.assetDatabase.getAssetById(asset.id).then((file) => {
      if (!file) return;

      const dataUrl = URL.createObjectURL(file);
      setAsset({ ...asset, url: dataUrl });
    });
  }, [settings, settings?.background?.id]);

  if (!settings) return preloadedAsset;

  return asset;
};
