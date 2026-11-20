import { Presence } from "./interfaces/Presence";
var gameEntries: any[] | null = null
var gameEntriesPromise: Promise<any[]> | null = null
const CACHE_KEY = "dc_detectable_v1"
const CACHE_TTL = 7 * 24 * 60 * 60 * 1000

function loadGameEntries(): Promise<any[]> {
  if (gameEntries) return Promise.resolve(gameEntries)
  if (gameEntriesPromise) return gameEntriesPromise
  try {
    const raw = localStorage.getItem(CACHE_KEY)
    if (raw) {
      const { t, d } = JSON.parse(raw)
      if (Date.now() - t < CACHE_TTL) return Promise.resolve((gameEntries = d))
    }
  } catch {}
  gameEntriesPromise = fetch("https://discord.com/api/v9/applications/detectable")
    .then((r) => r.json())
    .then((all: any[]) => {
      // keep only fields used, shrink storage
      gameEntries = all.map(({ name, themes, third_party_skus }) => ({ name, themes, third_party_skus }))
      try {
        localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), d: gameEntries }))
      } catch {}
      return gameEntries
    })
    .finally(() => { gameEntriesPromise = null })
  return gameEntriesPromise
}

export async function DC_UpdateToGamePresence(
  presence: Presence,
): Promise<any> {
  const steamUrl = (id: number) => `https://cdn.akamai.steamstatic.com/steam/apps/${id}/library_600x900.jpg`
  return await loadGameEntries()
    .then(
      (gameEntries) => {
        return gameEntries?.find(
          (_gameEntry) => {
            return (
              _gameEntry.name.toLowerCase().replace(/[^a-z0-9]/g, "").startsWith(
                presence.name.toLowerCase().replace(/[^a-z0-9]/g, "")
              )
            )
          }
        )
      }
    )
    .then(
      app => {
        console.log(app);
        presence.imageSrc = steamUrl(app.third_party_skus?.find((s: any) => s.distributor === "steam").id);
        presence.name = app.name;
        presence.album = "steam";
        presence.artist = app.themes.reduce((a: string, b: string) => `${a} - ${b} `, "")
      }
      //app also has some cool stuff like name and themes should figure tht out later
    );
}

