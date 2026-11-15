import { LFM_GetNowPlaying, LFM_GetAlbums } from "../lastfm";

export async function SetAlbums() {
  const albums = document.getElementById("albums");
  (await LFM_GetAlbums()).forEach(
    (album: any) => {
      const albumArt = document.createElement("img");
      const albumContainer = document.createElement("a");
      albumContainer.href = album.url;
      // albumContainer.target = "_blank";
      // albumContainer.rel = "noopener noreferrer";
      albumContainer.classList.add("albumContainer");
      albumContainer.appendChild(albumArt);
      albumArt.src = album.imageSrc;
      albums?.appendChild(albumContainer);
    }
  );

}

export async function SetNowPlaying() {
  const nowPlaying: Record<string, any> = await LFM_GetNowPlaying();
  console.log(nowPlaying);
  const image = document.createElement("img");
  image.src = nowPlaying.imageSrc;
  image.style.borderRadius = "20px";

  const div = document.getElementById("nowPlaying");
  div!.style.display = "flex";
  div!.style.flexDirection = "row";
  div!.style.alignItems = "center";
  div!.style.gap = "12px";
  div?.appendChild(image);

  const textColumn = document.createElement("div");
  textColumn.style.display = "flex";
  textColumn.style.flexDirection = "column";
  div?.appendChild(textColumn);

  const addProperty = (attr: string, type: string) => {
    const text = document.createElement(type);
    text.textContent = nowPlaying[attr];
    textColumn.appendChild(text)
  }
  addProperty("name", "h2");
  addProperty("artist", "h3");
  addProperty("album", "p");

}
