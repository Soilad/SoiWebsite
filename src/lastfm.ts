export async function LFM_GetAlbums() {
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
              return {
                imageSrc: album.image[1]?.["#text"],
                url: album.url,
              };
            }
          )
          .filter(
            (album: any) => {
              return album.imageSrc
            }
          )
          ;
      }
    )
}
export async function LFM_GetNowPlaying() {
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

        return {
          imageSrc: imageSrc,
          artist: artist,
          album: album,
          name: name,
          url: url
        };
      }
    )
}
