use std::{error::Error, fs};

use reqwest::{self, Client, Url};
mod lastfm;
use lastfm::{TopAlbums, TopAlbumsResponse};
use serde::{Deserialize, Serialize};

use crate::lastfm::TopAlbum;

const IMAGE_SIZE: usize = 1;

#[derive(Debug, Deserialize, Serialize)]
struct Album {
    imageSrc: String,
    url: String,
}

async fn get_lastfm_albums() -> Result<TopAlbums, Box<dyn Error>> {
    let _ = dotenvy::from_path("../.dev.vars");
    let LASTFM_API_KEY: String = std::env::var("LASTFM_API_KEY").expect("LASTFM_API_KEY not set");
    let url: Url = Url::parse_with_params(
        "https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums",
        &[
            ("user", "soilad"),
            ("format", "json"),
            ("api_key", &LASTFM_API_KEY),
        ],
    )
    .unwrap();
    let client = Client::new();
    let response = client.get(url).send().await?.text().await?;
    Ok(serde_json::from_str::<TopAlbumsResponse>(&response)?.topalbums)
    // if let Ok(response) = client.get(url).send().await?.text().await {
    //     serde_json::from_str(&response);
    // };
}

fn _format_albums(album: TopAlbum) -> Album {
    Album {
        imageSrc: album.image[IMAGE_SIZE].url.clone(),
        url: album.url,
    }
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let albums: Vec<Album> = get_lastfm_albums()
        .await?
        .album
        .into_iter()
        .map(_format_albums)
        .collect();
    let args: Vec<String> = std::env::args().collect();
    fs::write(
        args.get(1).unwrap_or(&"./TopAlbums.json".to_string()),
        serde_json::to_string_pretty(&albums)?,
    )?;
    Ok(())
}
