export default {
  async fetch(request: Request, env: any) {
    const url = new URL(request.url);
    var res: Response;
    switch (url.pathname) {
      case "/api/now-playing":
        res = await fetch(
          `https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=soilad&limit=1&format=json&api_key=${env.LASTFM_API_KEY}`
        );
        break;
      case "/api/get-albums":
        res = await fetch(
          `http://ws.audioscrobbler.com/2.0/?method=user.gettopalbums&user=soilad&api_key=${env.LASTFM_API_KEY}&format=json`
        );
        break;
      default:
        return env.ASSETS.fetch(request); // serve your static site
    }
    return new Response(
      await res.text(),
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=30",
        },
      }
    );
  },
};
