import { ApiError } from "@/lib/utils/errors";

export type VideoMetadata = {
  title: string;
  description: string;
  thumbnail: string;
  channel: string;
};

type OEmbedResponse = {
  title?: string;
  author_name?: string;
  thumbnail_url?: string;
};

function decodeHtmlEntities(value: string) {
  return value
    .replaceAll("&quot;", '"')
    .replaceAll("&#39;", "'")
    .replaceAll("&amp;", "&")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .trim();
}

async function fetchWithTimeout(url: string, timeoutMs: number) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "user-agent": "youtube-transcript-api/1.0"
      },
      next: { revalidate: 0 }
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function getDescription(videoId: string) {
  const watchUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  const response = await fetchWithTimeout(watchUrl, 8000);

  if (!response.ok) {
    return "";
  }

  const html = await response.text();
  const metaMatch = html.match(/<meta\s+name="description"\s+content="([^"]*)"/i);

  return metaMatch ? decodeHtmlEntities(metaMatch[1]) : "";
}

export async function getMetadata(videoId: string): Promise<VideoMetadata> {
  const videoUrl = `https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}`;
  const oEmbedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`;

  try {
    const response = await fetchWithTimeout(oEmbedUrl, 8000);

    if (response.status === 404) {
      throw new ApiError(404, "video_not_found", "Video metadata was not found");
    }

    if (!response.ok) {
      throw new ApiError(502, "youtube_metadata_error", "YouTube metadata fetch failed");
    }

    const data = (await response.json()) as OEmbedResponse;
    const description = await getDescription(videoId).catch(() => "");

    return {
      title: data.title ?? "",
      description,
      thumbnail: data.thumbnail_url ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      channel: data.author_name ?? ""
    };
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Unable to fetch metadata";
    throw new ApiError(502, "youtube_metadata_error", "YouTube metadata fetch failed", {
      reason: message
    });
  }
}
