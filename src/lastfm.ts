import { Presence } from "./interfaces/Presence";
import { Album } from "./interfaces/Album";

function _LFM_FormatAlbums(a_json: any) {
  const albums = a_json.album;
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
    );
}

export async function LFM_GetAlbums(): Promise<Album[]> {
  return fetch(import.meta.env.BASE_URL + "data/top-albums.json")
    .then(
      response => {
        if (response.ok) {
          return response.json();
        }
      }
    )
    .then(_LFM_FormatAlbums)
}

export async function RS_GetAlbums() {
  console.log(window.location.origin + "/TopAlbums.json");
  return fetch(window.location.origin + "/TopAlbums.json")
    .then(
      response => {
        if (response.ok) {
          return response.json()
        }
      }
    )
    ;
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
