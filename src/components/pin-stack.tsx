import { useSettings } from "../providers/SettingsProvider";
import { IconPin } from "./icon-pin";

export const PinStack = () => {
  const settings = useSettings();

  if (!settings) return null;

  return (
    <section className="flex gap-2 mt-2 w-full">
      {settings.pins.map((pin, index) => (
        <IconPin key={pin.type + "-" + index} type={pin.type} url={pin.url} />
      ))}
    </section>
  );
};
