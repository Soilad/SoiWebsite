use std::{error::Error, fs};

use reqwest::{self, Client, Url};
mod lastfm;
use lastfm::{TopAlbums, TopAlbumsResponse};

async fn get_lastfm_albums() -> Result<TopAlbums, Box<dyn Error>> {
    let _ = dotenvy::from_path("../.dev.vars");
    let LASTFM_API_KEY: String = std::env::var("LASTFM_API_KEY").expect("LASTFM_API_KEY not set");
    let url: Url = Url::parse_with_params(
        "https://ws.audioscrobbler.com/2.0/?method=user.gettopalbums",
        &[
            ("user", "soilad"),
            ("format", "json"),
            ("limit", "1"),
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

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error>> {
    let albums = get_lastfm_albums().await?;
    let args: Vec<String> = std::env::args().collect();
    fs::write(
        args.get(1).unwrap_or(&"./TopAlbums.json".to_string()),
        serde_json::to_string_pretty(&albums)?,
    )?;
    Ok(())
}
