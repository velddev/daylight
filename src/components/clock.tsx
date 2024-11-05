import { useEffect, useState } from "react";

export const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <h1 id="time">
      <span id="hour">{time.getHours()}</span>:
      <span id="minute">{time.getMinutes().toString().padStart(2, "0")}</span>
    </h1>
  );
};
