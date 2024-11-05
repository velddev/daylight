import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/index.css";
import { InputBar } from "./components/input-bar";
import { Clock } from "./components/clock";
import pins from "./config/pins";
import { Pin } from "./components/pin";
import { BackgroundVideo } from "./components/background-video";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <div id="overlay"></div>
    <BackgroundVideo />
    <main id="app">
      <Clock />
      <div className="pb-[64px]" />
      <InputBar />
      <section id="action-bar">
        <section id="pin">
          {pins.map((pin, index) => (
            <Pin key={pin.type + "-" + index} type={pin.type} url={pin.url} />
          ))}
        </section>
      </section>
      <div className="pb-[128px]" />
    </main>
  </StrictMode>
);
