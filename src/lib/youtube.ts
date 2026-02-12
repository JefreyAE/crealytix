export async function fetchYouTubeChannel(channelId: string) {
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${process.env.YOUTUBE_API_KEY}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found");
  }

  const item = data.items[0];

  return {
    title: item.snippet.title,
    subscriberCount: Number(item.statistics.subscriberCount),
    viewCount: Number(item.statistics.viewCount),
    videoCount: Number(item.statistics.videoCount),
  };
}



export async function resolveChannelId(input: string) {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  // Caso 1: Ya es channel ID
  if (input.startsWith("UC")) {
    return input;
  }

  // Extraer handle de URL
  let handle = input;

  if (input.includes("@")) {
    const match = input.match(/@([^\/]+)/);
    if (match) {
      handle = match[1];
    }
  }

  // Buscar canal por handle
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${handle}&key=${API_KEY}`
  );

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found");
  }

  return data.items[0].snippet.channelId;
}