import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { createSettings, SettingsManager } from "../lib/settings";
import { createLogger } from "../lib/logger";

const logger = createLogger("SettingsProvider");

type SettingsContextType =
  | {
      state: "ready";
      settings: SettingsManager;
      saveHash: string;
    }
  | {
      state: "pending";
    };

const SettingsContext = createContext<SettingsContextType>({
  state: "pending",
});

export const SettingsProvider = ({ children }: PropsWithChildren<{}>) => {
  const [context, setContext] = useState<SettingsContextType>({
    state: "pending",
  });

  useEffect(() => {
    createSettings()
      .then(async (v) => {
        await v.init();
        return v;
      })
      .then((v) => {
        setContext({
          state: "ready",
          settings: v,
          saveHash: Date.now().toString(),
        });
      });
  }, []);

  useEffect(() => {
    if (context.state !== "ready") return;

    const updateHash = () => {
      logger.info("updated setting context");
      setContext({
        state: "ready",
        settings: context.settings,
        saveHash: Date.now().toString(),
      });
    };

    context.settings.addEventListener("save", updateHash);

    return () => {
      context.settings.removeEventListener("save", updateHash);
    };
  }, [context]);

  return (
    <SettingsContext.Provider value={context}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context.state !== "ready") {
    return null;
  }

  return context.settings;
};
