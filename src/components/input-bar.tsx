import { ReactNode, useState } from "react";
import {
  ClaudeIcon,
  GithubIcon,
  GlobeIcon,
  NetworkIcon,
  OpenAIIcon,
  PerplexityIcon,
  YoutubeIcon,
} from "./icons";
import pins from "../config/pins";
import { getPinIcon } from "./pin";

type LinkProvider = {
  id: string;
  name: string;
  match: (search: string) => string | null;
  link: (search: string) => string;
  icon: (search: string) => ReactNode;
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
    icon: () => <GlobeIcon />,
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
    icon: () => <GithubIcon />,
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
    icon: () => <NetworkIcon />,
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
    icon: () => <YoutubeIcon />,
  },
  {
    id: "pin",
    name: "Pinned",
    match: (search) => {
      if (!Number.isNaN(+search) && +search > 0 && +search <= pins.length) {
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
    icon: (search) => getPinIcon(pins[+search - 1].type),
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
    icon: () => <PerplexityIcon />,
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
    icon: () => <OpenAIIcon />,
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
    icon: () => <ClaudeIcon />,
  },
];

/**
 *
 * @param {string | null} currentMode
 * @param {string} search
 * @returns {string | null}
 */
const detectSearchMode = (currentMode: string | null, search: string) => {
  console.log({ currentMode, search });
  if (currentMode != null) {
    const provider = getModeById(currentMode);
    if (provider && provider.match(search) === null) return null;
  }

  const newProvider = linkProviders.find((p) => p.match(search) !== null);
  console.log({ newProvider });
  return newProvider !== undefined ? newProvider.id : null;
};

const composeLink = (search: string) => {
  const mode = detectSearchMode(null, search);
  if (mode != null) {
    const provider = getModeById(mode);
    if (provider != null) {
      return provider.link(search);
    }
  }

  return `https://www.google.com/search?q=${search}`;
};

const getModeById = (id: string | null) =>
  id === null ? null : linkProviders.find((p) => p.id === id);

export const InputBar = () => {
  const [value, setValue] = useState("");
  const [mode, setMode] = useState<string | null>(null);

  return (
    <form
      id="search"
      onSubmit={(e) => {
        e.preventDefault();
        const provider = getModeById(mode);
        if (provider) {
          window.location.href = composeLink(value);
        }
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
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
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
          {getModeById(mode)?.icon(value) ?? ""}
        </div>
      </div>
      <input
        onInput={(e) => {
          const search = (e.target as HTMLInputElement).value;
          const newMode = detectSearchMode(mode, search);
          console.log({ search, mode, newMode });
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
  );
};
