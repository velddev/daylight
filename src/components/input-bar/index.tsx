import { ComponentType, useEffect, useState } from "react";
import {
  ClaudeIcon,
  GithubIcon,
  GlobeIcon,
  IconProps,
  NetworkIcon,
  OpenAIIcon,
  PerplexityIcon,
  YoutubeIcon,
} from "../icons";
import { getPinIcon } from "../icon-pin";
import { Suggestion, useSuggestions } from "./useSuggestions";
import { twMerge } from "tailwind-merge";
import { SettingsManager } from "../../lib/settings";
import { useSettings } from "../../providers/SettingsProvider";

type LinkProvider = {
  id: string;
  name: string;
  match: (search: string, settings: SettingsManager) => string | null;
  link: (search: string, settings: SettingsManager) => string;
  icon: (search: string, settings: SettingsManager) => ComponentType<IconProps>;
};

const linkProviders: LinkProvider[] = [
  {
    id: "link",
    name: "Direct Link",
    match: (search) => {
      if (search.startsWith("//") || /(.*)[\.](.*)$/.test(search)) {
        return search;
      }
      return null;
    },
    link: (search) => `https:${search}`,
    icon: () => GlobeIcon,
  },
  {
    id: "github",
    name: "GitHub",
    match: (search) => {
      if (search.startsWith("gh ")) {
        return search.slice(3);
      }
      return null;
    },
    link: (search) => `http://github.com/${search}`,
    icon: () => GithubIcon,
  },
  {
    id: "localhost",
    name: "Localhost",
    match: (search) => {
      if (search.startsWith(":")) {
        return search;
      }
      return null;
    },
    link: (search) => `http://localhost${search}`,
    icon: () => NetworkIcon,
  },
  {
    id: "youtube",
    name: "YouTube",
    match: (search) => {
      if (search.startsWith("yt ")) {
        return search.slice(3);
      }
      return null;
    },
    link: (search) => `https://www.youtube.com/results?search_query=${search}`,
    icon: () => YoutubeIcon,
  },
  {
    id: "pin",
    name: "Pinned",
    match: (search, settings) => {
      if (
        !Number.isNaN(+search) &&
        +search > 0 &&
        +search <= settings.pins.length
      ) {
        return search;
      }
      return null;
    },
    link: (search) =>
      (
        document.getElementById("pin")!.children[
          +search - 1
        ] as HTMLAnchorElement
      ).href,
    icon: (search, settings) => getPinIcon(settings.pins[+search - 1].type),
  },
  {
    id: "ask",
    name: "Perplexity",
    match: (search) => {
      if (search.startsWith("ask ")) {
        return search.slice(4);
      }
      return null;
    },
    link: (search) => `https://www.perplexity.ai/search/new?q=${search}`,
    icon: () => PerplexityIcon,
  },
  {
    id: "chatgpt",
    name: "ChatGPT",
    match: (search) => {
      if (search.startsWith("gpt ")) {
        return search.slice(4);
      }
      return null;
    },
    link: (search) => `https://chat.openai.com/?q=${search}`,
    icon: () => OpenAIIcon,
  },
  {
    id: "claude",
    name: "Claude",
    match: (search) => {
      if (search.startsWith("cl ")) {
        return search.slice(3);
      }
      return null;
    },
    link: (search) => `https://claude.ai/new?q=${search}`,
    icon: () => ClaudeIcon,
  },
];

const detectSearchMode = (
  currentMode: string | null,
  search: string,
  settings: SettingsManager
) => {
  if (currentMode != null) {
    const provider = getModeById(currentMode);
    if (provider && provider.match(search, settings) === null) return null;
  }

  const newProvider = linkProviders.find(
    (p) => p.match(search, settings) !== null
  );
  return newProvider !== undefined ? newProvider.id : null;
};

const composeLink = (search: string, settings: SettingsManager) => {
  const mode = detectSearchMode(null, search, settings);
  if (mode != null) {
    const provider = getModeById(mode);
    if (provider != null) {
      const query = provider.match(search, settings);
      if (query != null) {
        return provider.link(query, settings);
      }
    }
  }

  return `https://www.google.com/search?q=${search}`;
};

const getModeById = (id: string | null) =>
  id === null ? null : linkProviders.find((p) => p.id === id);

export const InputBar = () => {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<string | null>(null);
  const [s, setS] = useState<Suggestion[] | null>(null);
  const suggestions = useSuggestions();
  const settings = useSettings();

  useEffect(() => {
    if (!value) {
      setS([]);
    }

    if (!settings) return;

    const valueMode = detectSearchMode(null, value, settings);
    if (valueMode != null) {
      setS([]);
      return;
    }

    const abortController = new AbortController();
    suggestions.getSuggestions(value, abortController).then((s) => {
      if (abortController.signal.aborted) return;
      setS(s);
    });

    return () => {
      abortController.abort();
    };
  }, [value]);

  let icon = null;
  const iconMode = getModeById(mode);
  if (iconMode && settings) {
    const Icon = iconMode.icon(value, settings);
    icon = <Icon className="w-5 h-5" />;
  }

  return (
    <div className="relative">
      <form
        className="rounded-md"
        id="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (!settings) return;
          window.location.href = composeLink(value, settings);
        }}
      >
        <div className="input-search-element">
          <div
            className={`input-search-element-inner transition ${
              mode === null ? "" : "fade-out-up"
            }`}
            id="search-icon"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="icon"
            >
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
          <div
            className={`input-search-element-inner transition ${
              mode === null ? "fade-out-down" : ""
            }`}
            id="search-icon-override"
          >
            {icon}
          </div>
        </div>
        <input
          onInput={(e) => {
            if (!settings) return;
            const search = (e.target as HTMLInputElement).value;
            const newMode = detectSearchMode(mode, search, settings);
            setMode(newMode);
          }}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          id="search-value"
          autoComplete="off"
          className="input"
          placeholder="Search"
          type="text"
          autoFocus
        />
      </form>
      <div
        className={twMerge(
          "absolute top-full card w-full flex text-white flex-col z-20 p-2 rounded-md mt-2 transition-all",
          value && s && s.length > 0 ? "fade-in-up" : "fade-out-up"
        )}
      >
        {s &&
          s.map((s, i) =>
            s.type === "answer" ? (
              <div key={i} className="flex items-center p-2">
                <div
                  key={i}
                  className="border border-white/20 w-full rounded-sm p-2"
                >
                  {s.content}
                </div>
              </div>
            ) : s.type === "link" ? (
              <a
                href={s.url}
                key={i}
                className="flex w-full items-center hover:bg-white/10 transition-all rounded-sm    p-2"
              >
                <div className="flex items-center gap-2 underline">
                  <span className="opacity-60">
                    <GlobeIcon className="w-5 h-5" />
                  </span>
                  {s.content}
                </div>
              </a>
            ) : s.type === "reword" ? (
              <div
                key={i}
                className="flex w-full items-center hover:bg-white/10 p-2"
              >
                <div>{s.content}</div>
              </div>
            ) : (
              <div
                key={i}
                className="flex w-full items-center hover:bg-white/10 p-2"
              >
                <div>
                  <span className="opacity-60">{value}</span>
                  {s.content}
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};
