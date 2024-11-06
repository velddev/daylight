import { useEffect, useRef } from "react";
import { BackgroundAssetWithUrl } from "./types";

export const BackgroundVideo = ({
  asset,
}: {
  asset: BackgroundAssetWithUrl;
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const save = () => {
      localStorage.setItem("bg:time", videoRef.current!.currentTime.toString());
    };

    window.addEventListener("beforeunload", save);
    return () => {
      window.removeEventListener("beforeunload", save);
    };
  }, []);

  useEffect(() => {
    if (!videoRef.current) return;

    const time = localStorage.getItem("bg:time");
    if (time) {
      videoRef.current.currentTime = parseFloat(time);
    }
  }, [videoRef]);

  return (
    <>
      <video
        className="fixed w-full h-full object-cover -z-3"
        ref={videoRef}
        autoPlay
        muted
        loop
      >
        <source src={asset.url} />
      </video>
      <div className="fixed inset-0 -z-2 bg-black/20" />
    </>
  );
};
