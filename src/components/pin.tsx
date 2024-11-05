import { BlueSkyIcon, TwitterIcon, YoutubeIcon } from "./icons";

const icons = {
  twitter: <TwitterIcon />,
  bluesky: <BlueSkyIcon />,
  youtube: <YoutubeIcon />,
} as const;

export type PinProps = {
  type: keyof typeof icons;
  url: string;
};

export const getPinIcon = (type: keyof typeof icons) => icons[type];

export const Pin = ({ type, url }: PinProps) => {
  return <a href={url}>{getPinIcon(type)}</a>;
};
