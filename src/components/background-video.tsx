import { useEffect, useRef } from "react";

export const BackgroundVideo = () => {
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
    <video id="bg" ref={videoRef} autoPlay muted loop>
      <source src="./vid_src.mp4" />
    </video>
  );
};
