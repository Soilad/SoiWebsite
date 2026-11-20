import { DC_UpdateToGamePresence } from "./discord.ts";
import { Presence } from "./interfaces/Presence.ts";

export async function LY_GetActivity(): Promise<Presence> {
  const result = await
    fetch("https://api.lanyard.rest/v1/users/772375561354870784")
      .then(
        (response) => response!.json()
      );
  const activityData = result.data.activities[0]
  console.log(activityData);

  const fmt = (ms: number) =>
    new Date(Math.max(0, ms)).toISOString().slice(-10, -5) // mm:ss, wraps after 1h

  const { start, end } = activityData.timestamps ?? {}

  const totalDuration = start && end ? (end - start) : 1
  const now = activityData.created_at
  const duration = start
    ? (now - start)
    : 0

  var presence: Presence = new Presence(
    "Not doing anything rn",
  )

  presence.start = start ?? 0;
  presence.duration = duration;
  presence.totalDuration = totalDuration;

  switch (activityData.type) {
    case 3:
      // reading
      break;
    case 2:
      presence.name = activityData.details
      presence.imageSrc = `https://media.discordapp.net/${activityData.assets.large_image.slice(3)}`
      presence.artist = activityData.assets.small_text
      presence.album = activityData.assets.large_text
      presence.url = activityData.url
      break;
    case 0:
      console.log(activityData);
      presence.name = activityData.name
      await DC_UpdateToGamePresence(presence)
      break;
    default:
      break;
  }
  return presence;
}
