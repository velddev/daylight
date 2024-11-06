import { ReactNode } from "react";
import { BlueSkyIcon, TwitterIcon, YoutubeIcon } from "./icons";
import { twMerge } from "tailwind-merge";

const icons = {
  twitter: <TwitterIcon className="w-5 h-5" />,
  bluesky: <BlueSkyIcon className="w-5 h-5" />,
  youtube: <YoutubeIcon className="w-5 h-5" />,
} as const;

export type PinType = {
  type: keyof typeof icons;
  url: string;
};

export type PinProps = PinType & {};

export const getPinIcon = (type: keyof typeof icons) => icons[type];

export const IconPin = ({ type, url }: PinProps) => {
  return <Pin href={url}>{getPinIcon(type)}</Pin>;
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
        `h-full aspect-square flex justify-center items-center bg-black/40 backdrop-blur-md rounded-md text-white hover:bg-black/20 transition-all`,
        className
      )}
    >
      {children}
    </a>
  );
};
