use serde::{Deserialize, Serialize};

// Shared

#[derive(Debug, Deserialize, Serialize)]
pub struct Image {
    pub size: String,
    #[serde(rename = "#text")]
    pub url: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Pagination {
    pub user: String,
    pub page: String,
    pub total: String,
}

// Error response (bad key, unknown user, etc). Returned instead of data.

#[derive(Debug, Deserialize, Serialize)]
pub struct LastfmError {
    pub error: u32,
    pub message: String,
}

// user.getrecenttracks

#[derive(Debug, Deserialize, Serialize)]
pub struct RecentTracksResponse {
    pub recenttracks: RecentTracks,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct RecentTracks {
    pub track: Vec<RecentTrack>,
    #[serde(rename = "@attr")]
    pub attr: RecentTracksAttr,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct RecentTracksAttr {
    pub user: String,
    pub total_pages: String,
    pub page: String,
    pub per_page: String,
    pub total: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct RecentTrack {
    pub name: String,
    pub url: String,
    pub mbid: String,
    pub streamable: String,
    pub artist: MbidText,
    pub album: MbidText,
    pub image: Vec<Image>,
    // Missing on the track currently playing
    pub date: Option<Date>,
    #[serde(rename = "@attr")]
    pub attr: Option<NowPlayingAttr>,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct MbidText {
    pub mbid: String,
    #[serde(rename = "#text")]
    pub text: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct Date {
    pub uts: String,
    #[serde(rename = "#text")]
    pub text: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct NowPlayingAttr {
    pub nowplaying: String,
}

// user.gettopalbums

#[derive(Debug, Deserialize, Serialize)]
pub struct TopAlbumsResponse {
    pub topalbums: TopAlbums,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TopAlbums {
    pub album: Vec<TopAlbum>,
    #[serde(rename = "@attr")]
    pub attr: TopAlbumsAttr,
}

#[derive(Debug, Deserialize, Serialize)]
#[serde(rename_all = "camelCase")]
pub struct TopAlbumsAttr {
    pub user: String,
    pub total_pages: String,
    pub page: String,
    pub per_page: String,
    pub total: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct TopAlbum {
    pub name: String,
    pub playcount: String,
    pub mbid: String,
    pub url: String,
    pub artist: ArtistInfo,
    pub image: Vec<Image>,
    #[serde(rename = "@attr")]
    pub attr: RankAttr,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct ArtistInfo {
    pub name: String,
    pub url: String,
    pub mbid: String,
}

#[derive(Debug, Deserialize, Serialize)]
pub struct RankAttr {
    pub rank: String,
}
