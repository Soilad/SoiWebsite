import { LFM_GetNowPlaying, LFM_GetAlbums } from "../lastfm";

export async function SetAlbums() {
  const albums = document.getElementById("albums");
  console.log(await LFM_GetAlbums());
  LFM_GetAlbums()
    .then(
      a_albums =>
        a_albums.forEach(
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
        )
    );
}
