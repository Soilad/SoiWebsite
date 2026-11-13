export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    if (url.pathname === "/api/now-playing") {
      const res = await fetch(
        `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=soilad&limit=1&format=json&api_key=${env.LASTFM_API_KEY}`
      );
      return new Response(await res.text(), {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=30",
        },
      });
    }
    return env.ASSETS.fetch(request); // serve your static site
  },
};
