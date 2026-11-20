import { Presence } from "./interfaces/Presence";
import { Album } from "./interfaces/Album";

export async function LFM_GetAlbums(): Promise<Album[]> {
  return fetch(window.location.origin + "/api/get-albums")
    .then(
      response => {
        if (response.ok) {
          return response.json();
        }
      }
    )
    .then(
      json => {
        const albums = json.topalbums.album;
        return albums
          .map(
            (album: any) => {
              return new Album(
                album.image[1]?.["#text"],
                album.url,
              );
            }
          )
          .filter(
            (album: Album) => {
              return album.imageSrc
            }
          )
          ;
      }
    )
}

export async function LFM_GetNowPlaying(): Promise<Presence> {
  return fetch(window.location.origin + "/api/now-playing")
    .then(
      response => {
        if (response.ok) {
          return response.json();
        }
      }
    )
    .then(
      json => {
        const track = json.recenttracks.track[0];
        console.log(track);
        const imageSrc = track.image[2]?.["#text"];
        const artist = track.artist?.["#text"];
        const name = track.name;
        const album = track.album?.["#text"];
        const url = track.url;

        return new Presence(
          name,
          imageSrc,
          artist,
          album,
          url
        );
      }
    )
}
