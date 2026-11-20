export class Presence {
  name: string;
  start: number;
  duration: number;
  totalDuration: number;
  imageSrc: string | null;
  artist: string | null;
  album: string | null;
  url: string | null;
  constructor(
    a_name: string,
    a_start: number = 0,
    a_duration: number = 0,
    a_totalDuration: number = 1,
    a_imageSrc: string | null = null,
    a_artist: string | null = null,
    a_album: string | null = null,
    a_url: string | null = null,
  ) {

    this.name = a_name;
    this.start = a_start;
    this.duration = a_duration;
    this.totalDuration = a_totalDuration;
    this.imageSrc = a_imageSrc;
    this.artist = a_artist;
    this.album = a_album;
    this.url = a_url;

  }
}

