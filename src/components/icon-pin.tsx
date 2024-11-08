import { ComponentType, ReactNode } from "react";
import * as icon from "./icons";
import { twMerge } from "tailwind-merge";

export const pinIconNames = Object.keys(icon);
pinIconNames.sort();

export const pinIcons = {
  twitter: icon.TwitterIcon,
  bluesky: icon.BlueSkyIcon,
  youtube: icon.YoutubeIcon,
  github: icon.GithubIcon,
  globe: icon.GlobeIcon,
  network: icon.NetworkIcon,
  close: icon.CloseIcon,
  trash: icon.TrashIcon,
  sliders: icon.SlidersIcon,
  envelope: icon.EnvelopeIcon,
  facebook: icon.FacebookIcon,
  claude: icon.ClaudeIcon,
  openai: icon.OpenAIIcon,
  perplexity: icon.PerplexityIcon,
} as const;

export type PinType = {
  type: keyof typeof pinIcons;
  url: string;
};

export type PinProps = PinType & {};

export const getPinIcon = (
  type: keyof typeof pinIcons
): ComponentType<icon.IconProps> => pinIcons[type];

export const IconPin = ({ type, url }: PinProps) => {
  const Icon = getPinIcon(type);
  return (
    <Pin href={url}>
      <Icon className="w-5 h-5" />
    </Pin>
  );
};

export const Pin = ({
  children,
  href,
  onClick,
  className,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={twMerge(
        `h-full aspect-square size-12 flex justify-center items-center bg-black/40 backdrop-blur-md rounded-md text-white hover:bg-black/20 transition-all`,
        className
      )}
    >
      {children}
    </a>
  );
};
