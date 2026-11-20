import { LY_GetActivity } from "../lanyard.ts";
import type { Presence } from "../interfaces/Presence.ts";
import type { M3eLinearProgressIndicatorElement } from "@m3e/web/progress-indicator";

export async function SetPresence() {
  LY_GetActivity().then(
    (presence: Presence) => {
      console.log(presence);
      const image = document.createElement("img");
      image.src = presence.imageSrc!;
      image.style.borderRadius = "20px";
      image.style.width = "auto";
      image.style.height = "200px";

      const div = document.getElementById("nowPlaying");
      div!.style.display = "flex";
      div!.style.flexDirection = "row";
      div!.style.alignItems = "center";
      div!.style.gap = "12px";
      div?.prepend(image);

      const textColumn = document.getElementById("fish");
      const addProperty = (attr: "name" | "artist" | "album", type: string) => {
        const text = document.createElement(type);
        text.textContent = presence[attr] ?? "";
        textColumn?.appendChild(text)
      }
      addProperty("name", "h2");
      addProperty("artist", "h3");
      addProperty("album", "p");

      const progress = document.createElement("m3e-linear-progress-indicator") as M3eLinearProgressIndicatorElement;
      progress.variant = "wavy";
      progress.max = 1;
      progress.style.width = "100%";
      progress.style.setProperty("--m3e-progress-indicator-color", "var(--secondary)");
      progress.style.setProperty("--m3e-progress-indicator-track-color", "var(--tertiary)");
      const update = () => {
        progress.value = presence.totalDuration
          ? Math.min(1, Math.max(0, (Date.now() - presence.start) / presence.totalDuration))
          : 0;
        if (progress.isConnected) requestAnimationFrame(update);
      };
      textColumn?.appendChild(progress);
      update();

    }
  )
}
