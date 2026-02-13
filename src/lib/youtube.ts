
type YouTubeChannelResponse = {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
};

export async function fetchYouTubeChannel(
  channelId: string
): Promise<YouTubeChannelResponse> {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    throw new Error("YouTube API key not configured");
  }

  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`,
    { cache: "no-store" }
  );

  const data = await res.json();

  if (!data.items || data.items.length === 0) {
    throw new Error("Channel not found");
  }

  const channel = data.items[0];

  return {
    id: channel.id,
    title: channel.snippet.title,
    description: channel.snippet.description,
    thumbnail: channel.snippet.thumbnails?.high?.url ?? "",
    subscriberCount: Number(channel.statistics.subscriberCount ?? 0),
    viewCount: Number(channel.statistics.viewCount ?? 0),
    videoCount: Number(channel.statistics.videoCount ?? 0),
  };
}

export async function resolveChannelId(input: string) {
  const API_KEY = process.env.YOUTUBE_API_KEY;

  if (!API_KEY) {
    throw new Error("YouTube API key not configured");
  }

  const value = input.trim();

  // 1️⃣ Si ya es channel ID
  if (value.startsWith("UC")) {
    return value;
  }

  // 2️⃣ Extraer ID directo de /channel/
  const channelMatch = value.match(/channel\/(UC[\w-]+)/);
  if (channelMatch) {
    return channelMatch[1];
  }

  // 3️⃣ Extraer handle tipo @usuario
  const handleMatch = value.match(/@([\w.-]+)/);
  if (handleMatch) {
    const handle = handleMatch[1];

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${handle}&key=${API_KEY}`
    );

    const data = await res.json();

    if (data.items?.length) {
      return data.items[0].id;
    }
  }

  // 4️⃣ Extraer custom URL /c/ o /user/
  const customMatch = value.match(/(?:c|user)\/([\w-]+)/);
  if (customMatch) {
    const customName = customMatch[1];

    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${customName}&key=${API_KEY}`
    );

    const data = await res.json();

    if (data.items?.length) {
      return data.items[0].snippet.channelId;
    }
  }

  // 5️⃣ Fallback: intentar búsqueda directa
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${value}&key=${API_KEY}`
  );

  const data = await res.json();

  if (data.items?.length) {
    return data.items[0].snippet.channelId;
  }

  throw new Error("Channel not found");
}
